import express from 'express';
import cors from 'cors';
import data from './data';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config';
import userRouter from './routers/userRouter';

mongoose.connect(config.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(()=>{
  console.log("connected to mongodb");
})
.catch((error) =>{
  console.log(error.reason);
});


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRouter);
app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.get('/api/products/:id',(req,res)=>{
  const product = data.products.find((x) => x._id ===  req.params.id);
  if(product){
    res.send(product);
  }else{
    res.status(404).send({message: 'Product not found!'});
  }
  
});

app.use((err, req, res, next) => {
  const status = err.name && err.name === 'ValidationError' ? 400:500;
  res.status(status).send({message: err.message});
})

app.listen(8080, () => {
  console.log('serve at http://localhost:8080');
});