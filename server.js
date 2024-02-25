const express = require('express');
const mongoose = require('mongoose');
const {checkSchema,validationResult, matchedData}= require('express-validator')
const app = express();
const port = 3068;
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/exp-app-dec23')

  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log('error connecting to db', err);
  });

const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name:String
}, { timestamps: true });

const Category = model('Category', categorySchema);
// create Validator schema

const categoryValidationSchema = {
  name:{
    in:['body'],
    exists:{
      errorMessage:'Name is required'
    },
    notEmpty:{
      errorMessage:'Name cannot be empty'
    },
    trim:true,
    custom:{
      options:function(value){
        return Category.findOne({name:value})
        .then((obj)=>{
          if(obj){
            throw new Error('category  name already exists')
          }
          return true
         
        })
      }
    },
    custom:{
      options:function(value,{req}){
          // const fieldValue = req.body.name;
          const fieldValue = matchedData(req)
          console.log(fieldValue);
          if(typeof fieldValue !== 'string'||!fieldValue.includes(' ')){
              throw new Error("Field should not contain  a space")
              // return res.status(400).json({error:"name field cannot have space"})
          }
          return  true
      }
  }
  }
}

// idvalidatuon Schema

const idvalidationSchema =  {
  id:{

    in:['params'],
  isMongoId:{
    errorMessage:'shoud be a valid mongodb id '
  }
}
}

app.get('/all-categories', (req, res) => {
  Category.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

// app get
app.get('/single-category/:id',checkSchema(idvalidationSchema),(req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
 }
  const id = req.params.id;
  Category.findById(id)
  .then((category)=>{
    if(!category){
     return  res.status(404).json({})
    }
    res.json(category)

  })
  .catch((err)=>{
    res.json(err)
  })
  
})

// app.get('/single-category/:name',(req,res)=>{
//   const name= req.params.name;
//   Category.findOne({name:name})
//   .then((category)=>{
//     if(!category){
//      return  res.status(404).json({})
//     }
//     res.json(category)

//   })
//   .catch((err)=>{
//     res.json(err)
//   })
  
// })
app.put('/update-category/:id',checkSchema(categoryValidationSchema),checkSchema(idvalidationSchema),(req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
 }
  const id = req.params.id
  const body = req.body;
  Category.findByIdAndUpdate(id,body,{ new:true})
  .then((category)=>{
    if(!category){
      return res.status(404).json(category)
    }
    res.json(category)
  })
  .catch((err)=>{
    res.status(500).json(err)
  })
})

app.delete('/remove-category/:id',checkSchema(idvalidationSchema),(req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
 }
  const id = req.params.id;
  Category.findByIdAndDelete(id)
  .then((category)=>{
    if(!category){
      return res.status(404).json({})
    }
    res.json(category)
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).json({ error:'Internal server error'})
  })
})

app.post('/create-categories',checkSchema(categoryValidationSchema), (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
     return res.status(400).json({errors:errors.array()})
  }
  const body = req.body;
  // const categoryObj = new Category(body);
  // categoryObj.save()
  Category.create(body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

//expense-schema.......
const expenseSchema = new Schema({
  expenseDate: Date,
  amount: Number,
  description:String
}, { timestamps: true });

const Expense = model('Expense', expenseSchema);
const expenseValidationSchema = {
  expenseDate:{
    in:['body'],
  exists:{
    errorMessage:'expense datae is requires'
  },
  notEmpty:{
     errorMessage:'expense  date cannot be empty'
  },
  isDate:{
    errorMessage:'expense date is not valid'
  },
  custom:{
    options:function(value){
      if(new Date(value)>new Date()){
        throw new Error("expensedate cannot be  greater than todays date")
      }
      return true
    }
  }
  },
  amount:{
    in:['body'],
    exists:{
      errorMessage:'expense amount is required'
    },
    notEmpty:{
      errorMessage:'amount cannot be empty'
    },
    isNumeric:{
      errorMessage:'amount should be number'
    },
    custom:{
      options:function(value){
        if(value<1){
          throw new Error("amount should be greater than 1")
        }
        return true
      }
    }
  }

}





app.get('/list-expenses', (req, res) => {
  Expense.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});
// get Single expense
app.get('/single-expense/:id',checkSchema(idvalidationSchema),(req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return  res.status(400).json({errors:errors.array()})
  }
  const id  = req.params.id;
 Expense.findById(id)
  .then((expense)=>{
    if(!expense){
      return res.status(404).json({})
    }
    res.json(expense)
  })
  .catch((err)=>{
    res.json(err)
  })
})

// upate expense

app.put('/update-expense/:id',checkSchema(expenseValidationSchema),checkSchema(idvalidationSchema),(req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return  res.status(400).json({errors:errors.array()})
  }
  const id = req.params.id;
  const body = req.body;
  Expense.findByIdAndUpdate(id,body,{ new:true})
  .then((expense)=>{
    if(!expense){
     return  res.status(404).json({})
    }
    res.json(expense)
  })
  .catch((err)=>{
    res.status(500).json({ error:'Internal server error'})
  })

})

// delete 

app.delete('/delete-expense/:id',checkSchema(idvalidationSchema),(req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return  res.status(400).json({errors:errors.array()})
  }
  const id  =  req.params.id;
  
  Expense.findByIdAndDelete(id,body,{ new:true})
  .then((expense)=>{
      if(!expense){
        res.status(404).json({})
      }
      res.json(expense)
  })
  .catch((err)=>{
    res.status(500).json({error:'Internal server error'})
  })
})






app.post('/create-expenses',checkSchema(expenseValidationSchema),(req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
  const body = req.body;
  const expense = new Expense(body)
  expense.save()
  .then((data)=>{
    res.json(data)
  })
  .catch((err)=>{
    res.json(err);
  })
})

// app.post('/create-expenses', (req, res) => {
//   const body = req.body;
//   const expense = new Expense(body);

//   expense.save()
//     .then(() => {
//       // Fetch all expenses and calculate the total
//       Expense.find()
//         .then((expenses) => {
//           const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);

//           const responseData = {
//             expenseData: [body],
//             total: total,
//           };
//           res.json(responseData);
//         })
//         .catch((err) => {
//           res.json(err);
//         });
//     })
//     .catch((err) => {
//       res.json(err);
//     });
// });



// app.post('/create-expenses', (req, res) => {
//   const body = req.body;
//   const expense = new Expense(body);

//   expense.save()
//     .then(() => {
//       // Use aggregate to calculate the total
//       Expense.aggregate([
//         {
//           $group: {
//             _id: null,
//             total: { $sum: '$amount' }
//           }
//         }
//       ])
//       .then((result) => {
//         const total = result[0].total

//         const responseData = {
//           expenseData: [body],
//           total: total,
//         };

//         res.json(responseData);
//       })
//       .catch((err) => {
//         res.json(err);
//       });
//     })
//     .catch((err) => {
//       res.json(err);
//     });
// });


app.listen(port, () => {
  console.log('server running on port', port);
});
