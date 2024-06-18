const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

mongoose.connect('mongodb://localhost:27017/Datavid', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const EmployeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

app.post('/api/addEmployee', async (req, res) => {
    try {
        const { firstName, lastName, birthDate, country, city } = req.body;
        const today = new Date();
        const employeeBirthDate = new Date(birthDate);
        let age = today.getFullYear() - employeeBirthDate.getFullYear();
        const monthDiff = today.getMonth() - employeeBirthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < employeeBirthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            return res.status(400).json({ success: false, message: 'Employee must be at least 18 years old.' });
        }

        const existingEmployee = await Employee.findOne({ firstName, lastName, country, city });
        if (existingEmployee) {
            return res.status(400).json({ success: false, message: 'Employee already exists' });
        }

        const newEmployee = new Employee({
            firstName,
            lastName,
            birthDate: employeeBirthDate,
            country,
            city
        });

        await newEmployee.save();
        res.json({ success: true, message: 'Employee added successfully' });
    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ success: false, message: 'Failed to add employee', error: err });
    }
});

app.get('/api/employees', (req, res) => {
    Employee.find()
        .then(employees => {
            res.json({ success: true, data: employees });
        })
        .catch(err => {
            console.error('Error fetching employees:', err);
            res.status(500).json({ success: false, message: 'Failed to fetch employees' });
        });
});

app.delete('/api/deleteEmployee/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.status(200).json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ success: false, message: 'Failed to delete employee' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
