const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const geners = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Horor' },
  { id: 3, name: 'Anime' },
];

//! Get requests
app.get('/', (req, res) => {
  res.send(geners);
});

app.get('/api/geners/:id', (req, res) => {
  const gener = geners.find((c) => c.id === parseInt(req.params.id));
  if (!gener) {
    res.status(404).send(`This ID: ${req.params.id} does't existing`);
    return;
  }
  res.send(gener);
});

//! Post requests

app.post('/api/geners', (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const gener = {
    id: geners.length + 1,
    name: req.body.name,
  };

  geners.push(gener);
  res.send(geners);
});

//! Put requests
app.put('/api/geners/:id', (req, res) => {
  //check if id exist
  //if exist res with message
  const gener = geners.find((c) => c.id === parseInt(req.params.id));
  if (!gener) {
    res.status(400).send(`The ID ${req.params.id} is NOT existing`);
    return;
  }
  // validate
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  gener.name = req.body.name;
  res.send(gener);
});

//! Delete requests
app.delete('/api/geners/:id', (req, res) => {
  const gener = geners.find((c) => c.id === parseInt(req.params.id));
  if (!gener) {
    res.status(400).send(`The ID ${req.params.id} is NOT existing`);
    return;
  }
  //delete
  const index = geners.indexOf(gener);
  geners.splice(index, 1);

  res.send(geners);
});

//! Validation logic

function validate(gener) {
  const schema = Joi.object({ name: Joi.string().min(4).required() });

  return schema.validate(gener);
}

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening to PORT ${port}`));
