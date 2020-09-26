const Joi = require('joi');
const express = require('express');
const { func } = require('joi');
const app = express();
// const joi = new Joi();

app.use(express.json());

const courses = [
  {
    id: 1,
    name: 'course01',
  },
  {
    id: 2,
    name: 'course02',
  },
  {
    id: 3,
    name: 'course03',
  },
];

//! Handling Get requests
app.get('/', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res
      .status(404)
      .send(`the course with id: ${req.params.id} not found , yours HISHAM `);
  } else {
    res.send(course);
  }
});

//! Handling Post requests
app.post('/api/courses', (req, res) => {
  const validationResult = validate(req.body);

  if (validationResult.error) {
    res.status(404).send(validationResult.error.details[0].error);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(courses);
});

//! Handling Put requests
app.put('/api/courses/:id', (req, res) => {
  // look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  //if not existing return 404
  if (!course) {
    res.status(404).send('course not existing');
    return;
  }
  // validate
  const validationResult = validate(req.body);
  //if invalid, return 400 - bad request
  if (validationResult.error) {
    res.status(400).send(validationResult.error.details);
    return;
  }
  // update the course
  course.name = req.body.name;
  // return the updated course
  res.send(course);
});

//! Handling Delete requests
app.delete('/api/courses/:id', (req, res) => {
  //look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  //if not existing return 404
  if (!course) {
    res.status(404).send('This course does not existing');
    return;
  }
  //delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //return the same course
  res.send(course);
});

//! Validation
function validate(course) {
  const schema = Joi.object({ name: Joi.string().min(3).required() });

  return schema.validate(course);
}

//! PORT
let port = process.env.port || 3000;
app.listen(port, () => console.log(`listening at port ${port}`));
