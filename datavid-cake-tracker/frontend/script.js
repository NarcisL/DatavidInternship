document.addEventListener('DOMContentLoaded', function() {
    const adminButton = document.getElementById('confirm-admin');
    const adminModule = document.getElementById('adminModule');
    const employeeModule = document.getElementById('employeeModule');
    const employeeListModule = document.getElementById('employeeListModule');
    const closeButtons = document.querySelectorAll('.close-button');
    const adminForm = document.getElementById('adminForm');
    const employeeForm = document.getElementById('employeeForm');
    const filterByBirthdayButton = document.getElementById('filterByBirthday');
    const employeeListBody = document.getElementById('employeeListBody');
    const countdownMessage = document.querySelector('.countdown');
    let adminStatus = false;

    adminButton.addEventListener('click', function() {
        adminModule.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            adminModule.style.display = 'none';
            employeeModule.style.display = 'none';
            employeeListModule.style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target == adminModule) {
            adminModule.style.display = 'none';
        } else if (event.target == employeeModule) {
            employeeModule.style.display = 'none';
        }
    });

    adminForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const passwordInput = document.getElementById('password').value;
        if (passwordInput === 'MilkyWay') {
            adminModule.style.display = 'none';
            adminButton.style.display = 'none';
            const addEmployeeButton = document.createElement('button');
            addEmployeeButton.textContent = 'Add Employee';
            addEmployeeButton.id = 'add-employee';
            document.querySelector('.buttons').appendChild(addEmployeeButton);
            adminStatus = true;
            addEmployeeButton.addEventListener('click', function() {
                employeeModule.style.display = 'block';
            });
            const actionsHeader = document.getElementById('actionsHeader');
            actionsHeader.style.display = 'table-cell';

        } else {
            alert('Incorrect password. Please try again.');
        }
    });

    employeeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const birthDate = document.getElementById('birthDate').value;
        const country = document.getElementById('country').value;
        const city = document.getElementById('city').value;

        const employeeData = {
            firstName,
            lastName,
            birthDate,
            country,
            city,
        };

        fetch('/api/addEmployee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Network response was not ok');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            if (!data.success) {
                alert(data.message);
            } else {
                alert('Employee added successfully');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add employee. Please try again later.');
        });

        employeeModule.style.display = 'none';
    });

    document.getElementById('show-employees').addEventListener('click', function() {
        fetch('/api/employees')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                renderEmployeeList(data.data);
                employeeListModule.style.display = 'block';
                checkBirthdayToday(data.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
    
    fetchEmployeesAndCheckBirthday();

    function fetchEmployeesAndCheckBirthday() {
        fetch('/api/employees')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                renderEmployeeList(data.data);
                checkBirthdayToday(data.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function checkBirthdayToday(employees) {
        const today = new Date();
        const todayString = `${today.getMonth() + 1}/${today.getDate()}`;
        let birthdayMessages = '';
        let nextBirthday = null;

        employees.forEach(employee => {
            const birthDate = new Date(employee.birthDate);
            const birthDateString = `${birthDate.getMonth() + 1}/${birthDate.getDate()}`;

            if (birthDateString === todayString) {
                birthdayMessages += `Today is ${employee.firstName} ${employee.lastName}'s from ${employee.city}, ${employee.country} Birthday! Hurry up and send them a gift!<br>`;
            } else {
                let nextBirthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
                if (nextBirthdayThisYear < today) {
                    nextBirthdayThisYear.setFullYear(today.getFullYear() + 1);
                }
                if (!nextBirthday || nextBirthdayThisYear < nextBirthday) {
                    nextBirthday = nextBirthdayThisYear;
                }
            }
        });

        if (birthdayMessages !== '') {
            document.querySelector('.message').innerHTML = birthdayMessages;
            countdownMessage.style.display = 'none';
        } else {
            document.querySelector('.message').textContent = "No employee was born today :(";
            if (nextBirthday) {
                const diff = calculateDaysUntil(nextBirthday);
                countdownMessage.textContent = `However, the next birthday is in ${diff.months} months and ${diff.days} days. Enough time to prepare a surprise!`;
                countdownMessage.style.display = 'block';
            }
        }
    }
    
    //logica pentru countdown
    function calculateDaysUntil(nextBirthday) {
        const today = new Date();
        const diffTime = Math.abs(nextBirthday - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;
        return { months, days };
    }

    filterByBirthdayButton.addEventListener('click', function() {
        const employees = Array.from(employeeListBody.children);
        employees.sort(compareBirthdays);
        employeeListBody.innerHTML = '';
        employees.forEach(employee => {
            employeeListBody.appendChild(employee);
        });
    });

    function compareBirthdays(a, b) {
        const birthDateA = new Date(a.dataset.birthDate);
        const birthDateB = new Date(b.dataset.birthDate);
        const today = new Date();
    
        birthDateA.setFullYear(today.getFullYear());
        birthDateB.setFullYear(today.getFullYear());
    
        const isTodayA = birthDateA.getMonth() === today.getMonth() && birthDateA.getDate() === today.getDate();
        const isTodayB = birthDateB.getMonth() === today.getMonth() && birthDateB.getDate() === today.getDate();
    
        if (isTodayA && !isTodayB) {
            return -1;
        } else if (!isTodayA && isTodayB) {
            return 1;
        }
    
        //dif in milisec
        const diffA = Math.abs(birthDateA - today);
        const diffB = Math.abs(birthDateB - today);
    
        if (birthDateA < today && birthDateB >= today) {
            return 1; // B dupa azi, A inainte de azi
        } else if (birthDateB < today && birthDateA >= today) {
            return -1; // A dupa azi, B inainte de azi
        } else if (birthDateA >= today && birthDateB >= today) {
            return diffA - diffB; // A si B dupa azi
        } else if (birthDateA < today && birthDateB < today) {
            return diffB - diffA; // A si B inainte de azi
        } else {
            //A si B aceasi zi
            return 0;
        }
    }

    function renderEmployeeList(employees) {
        employeeListBody.innerHTML = '';
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.dataset.birthDate = employee.birthDate;
            row.innerHTML = `
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.country}</td>
                <td>${employee.city}</td>
                <td>${new Date(employee.birthDate).toLocaleDateString()}</td>
            `;
            if (adminStatus) {
                const actionCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', function() {
                    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
                        deleteEmployee(employee);
                    }
                });
                actionCell.appendChild(deleteButton);
                row.appendChild(actionCell);
            }
            employeeListBody.appendChild(row);
        });
    }

    function deleteEmployee(employee) {
        fetch(`/api/deleteEmployee/${employee._id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert(data.message);
            fetchEmployeesAndCheckBirthday();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete employee. Please try again later.');
        });
    }
    

    function validateTextInput(event) {
        const char = String.fromCharCode(event.keyCode);
        const pattern = /^[a-zA-Z\s]*$/;
        if (!pattern.test(char)) {
            event.preventDefault();
        }
    }

    document.getElementById('firstName').addEventListener('keypress', validateTextInput);
    document.getElementById('lastName').addEventListener('keypress', validateTextInput);
    document.getElementById('country').addEventListener('keypress', validateTextInput);
    document.getElementById('city').addEventListener('keypress', validateTextInput);
});


