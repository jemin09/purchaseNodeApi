let express=require("express");
let app=express();
app.use(express.json());
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});

var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app Listening on port ${port}`));
const {Client}=require('pg');
var format = require('pg-format');
const client=new Client({
  user:"postgres",
  password:"Jesmin@12344",
  database:"postgres",
  port:"5432",
  host:"db.yvhnlegtztynqyvxraaf.supabase.co",
  // host:"localhost",
  ssl:{rejectUnauthorized:false},
});

client.connect(function(res,error){
  console.log(`Connect!!!`);
});

let {dataJson}=require("./shopData.js");
app.get("/shops",function(req,res){
  let sql=`SELECT * FROM shops`;
  client.query(sql,function(err,data) {
    if(err) res.status(404).send(err);
    else{
      res.send(data.rows);
    }        
  }); 
});
app.get("/products",function(req,res){
  let sql=`SELECT * FROM products`;
  client.query(sql,function(err,data) {
    if(err) res.status(404).send(err);
    else{
      res.send(data.rows);
    }        
  }); 
});

app.get("/purchases",function(req,res){
  let product=req.query.product;
  let shop=req.query.shop;
  let sort=req.query.sort;
  let options="";
  let optionArr=[];
  let data={};
  let sortopt="";

  // console.log("outside product",productid,"shopId",shopId);
  
  if(shop){
    let shops=[];
    shops.push(shop)
    options=options?`${options} AND "shopId"=ANY($1::int[])` : `"shopId"=ANY($1::int[])`;    
    optionArr.push(shops); 
  }
  if(product){
    console.log("in product");
    let productArr=product.split(","); 
    options=options?`${options} AND productid=ANY($2::int[])` : "productid=ANY($1::int[])";
    optionArr.push(productArr); 
  }
  if(sort==="QtyAsc"){
    sortopt="ORDER BY quantity ASC";
  }
  if(sort==="QtyDesc"){
    sortopt="ORDER BY quantity DESC";
  }
  if(sort==="ValueAsc"){
    sortopt="ORDER BY quantity*price ASC";
  }
  if(sort==="ValueDesc"){
    sortopt="ORDER BY quantity*price DESC";
  }
  let sql=`SELECT * FROM purchases ${options?"WHERE":""} ${options} ${sortopt}`;  
  console.log("optionsArr=",optionArr,"sql=",sql); 
  client.query(sql,optionArr,function(err,result) {
    if(err) {
      console.log(err)
      res.status(404).send(err);
    }
    else{
      data["purchases"]=result.rows;
      let sql1=`SELECT "productId" FROM products`;
      client.query(sql1,function(err,result) {
        if(err) {
          console.log(err)
          res.status(404).send(err);
        }
        else{
          console.log("result",result)
          data["productOpt"]=result.rows;
          let sql2=`SELECT "shopId" FROM shops`;
          client.query(sql2,function(err,result) {
            if(err) {
              console.log(err)
              res.status(404).send(err);
            }
            else{
              console.log("result",result)
              data["shopOpt"]=result.rows;
              res.send(data);
            }        
          });
        }        
      });
    }        
  });
});

app.get("/purchases/products/:id",function(req,res){
  let id=req.params.id;
  let data={};
  let sql=`SELECT * FROM purchases where productid=$1`; 
  client.query(sql,[id],function(err,result) {
    if(err) res.status(404).send(err);
    else{
      data["purchases"]=result.rows;
      let sql1=`SELECT "productId" FROM products`;
      client.query(sql1,function(err,result) {
        if(err) {
          console.log(err)
          res.status(404).send(err);
        }
        else{
          console.log("result",result)
          data["productOpt"]=result.rows
          let sql2=`SELECT "shopId" FROM shops`;
          client.query(sql2,function(err,result) {
            if(err) {
              console.log(err)
              res.status(404).send(err);
            }
            else{
              console.log("result",result)
              data["shopOpt"]=result.rows
              res.send(data);
            }        
          });
        }        
      });
    }       
  }); 
});
app.get("/purchases/shops/:id",function(req,res){
  let id=+req.params.id;
  let data={};
  // console.log("shopId",shopId)
  let sql=`SELECT * FROM purchases where "shopId"=$1`; 
  client.query(sql,[id],function(err,result) {
    if(err) {
      console.log("err",err)
      res.status(404).send(err);
    }
    else{
      data["purchases"]=result.rows;
      let sql1=`SELECT "productId" FROM products`;
      client.query(sql1,function(err,result) {
        if(err) {
          console.log(err)
          res.status(404).send(err);
        }
        else{
          console.log("result",result)
          data["productOpt"]=result.rows
          let sql2=`SELECT "shopId" FROM shops`;
          client.query(sql2,function(err,result) {
            if(err) {
              console.log(err)
              res.status(404).send(err);
            }
            else{
              console.log("result",result)
              data["shopOpt"]=result.rows
              res.send(data);
            }        
          });
        }        
      });
    }       
  }); 
});
// app.get("/purchases",function(req,res){
//   let data={};
//   let sql=`SELECT * FROM purchases`;   
//   client.query(sql,function(err,result) {
//     if(err) {
//       console.log(err)
//       res.status(404).send(err);
//     }
//     else{
//       data["purchases"]=result.rows;
//       let sql1=`SELECT "productId" FROM products`;
//       client.query(sql1,function(err,result) {
//         if(err) {
//           console.log(err)
//           res.status(404).send(err);
//         }
//         else{
//           console.log("result",result)
//           data["productOpt"]=result.rows
//           let sql2=`SELECT "shopId" FROM shops`;
//           client.query(sql2,function(err,result) {
//             if(err) {
//               console.log(err)
//               res.status(404).send(err);
//             }
//             else{
//               console.log("result",result)
//               data["shopOpt"]=result.rows
//               res.send(data);
//             }        
//           });
//         }        
//       });
//     }        
//   });
// });
app.get("/products/:prodname",function(req,res){
  let prodname=req.params.prodname;
  let sql=`SELECT * FROM products where "productName"=$1`;
  client.query(sql,[prodname],function(err,data) {
    if(err) res.status(404).send(err);
    else{
      res.send(data.rows);
    }        
  }); 
});
app.get("/totalPurchase/shop/:id",function(req,res){
  let id=req.params.id;
  let sql=`SELECT productid,"shopId",  COUNT(productid) AS totalpurchase FROM purchases WHERE "shopId"=$1 GROUP BY "shopId",productid `;
  client.query(sql,[id],function(err,data) {
    if(err) {
      console.log(err)
      res.status(404).send(err);
    }
    else{
      console.log("result",data)
      res.send(data.rows);
    }        
  }); 
});
app.get("/totalPurchase/product/:id",function(req,res){
  let productid=req.params.id;
  let sql=`SELECT productid,"shopId",  COUNT("shopId") AS totalpurchase FROM purchases WHERE productid=$1 GROUP BY "shopId",productid `;
  client.query(sql,[productid],function(err,data) {
    if(err) res.status(404).send(err);
    else{
      res.send(data.rows);
    }        
  }); 
});
app.post("/purchases",function(req,res){
  let body=req.body;
  let sql=`INSERT INTO purchases("shopId",productid, quantity,price) VALUES($1,$2,$3,$4)`;
  client.query(sql,[body.shopId,body.productid, body.quantity,body.price],function(err,data){
    if(err) {
      console.log("err",err);
      res.status(404).send("Error in fetching data");    }
    else{
        res.send(`Post sucess. name of new purchase is ${body.shopId}`);
      }
  })
});
app.post("/products",function(req,res){
  let body=req.body;
  let sql=`SELECT * FROM products where "productName"=$1`;
  client.query(sql,[body.productName],function(err,data) {
    if(err) res.status(404).send(err);
    else if(data.length>0)res.status(404).send(`product Name already exists : ${body.productName}`);
    else{
      let sql=`INSERT INTO products("productName",category,description) VALUES($1,$2,$3)`;
      client.query(sql,[body.productName,body.category,body.description],function(err,data){
       if(err) res.status(404).send("Error in fetching data");
       else{
           res.send(`Post sucess. name of new purchase is ${body.productName}`);
         }
        })
    }        
  });   
});
app.post("/shops",function(req,res){
  let body=req.body;
  let sql=`SELECT * FROM shops where name=$1`;
  client.query(sql,[body.name],function(err,data) {
    if(err) {
      res.status(404).send(err);
    }
    else if(data.rows.length>0)res.status(404).send(`Shop Name already exists : ${body.name}`);
    else{
      let sql=`INSERT INTO shops(name,rent) VALUES($1,$2)`;
      client.query(sql,[body.name,body.rent],function(err,data){
       if(err) {
        console.log(err);
        res.status(404).send("Error in fetching data");
      }
       else{
            console.log(data);
            res.send(`Post sucess. name of new purchase is ${body.name}`);
         }
        })
    }        
  });   
});
app.put("/products/:proname",function(req,res){
  let body=req.body;
  let proname=req.params.proname;
  let sql=`UPDATE products SET category=$1,description=$1 WHERE "productName"=$1`;
  let params=[body.category,body.description,proname];
  client.query(sql,[params],function(err,data){
    if(err){
      console.log(err);
      res.status(404).send("Error in Updating data");
    }
    else if(data.affectedRows===0){
      res.status(404).send("No update happened");
    }
    else res.send("Update success");
  })
});

app.get("/resetData",function(req,res){
  let sql="TRUNCATE purchases RESTART IDENTITY";
  client.query(sql,function(err,result){
    if(err){
      console.log(err);
      res.status(404).send("Error in delete data");
    }
    else{ 
      console.log(`Deletion Success.Deleted ${result.affectedRows} rows`);
      let arr=dataJson.purchases.map(st=>[
        st.shopId,
        st.productid,
        st.quantity,
        st.price
      ]);
      let sql1=`INSERT INTO purchases("shopId",productid,quantity,price) VALUES %L`;
      client.query(format(sql1,arr),function(err,data){
        if(err){
          console.log(err);
          res.status(404).send("Error in inserting data");
        }
        else res.send(`Reset Success.Inserted ${data.affectedRows} rows`);
      })
    }
  })
});

//   let shopId=req.query.shop;   
//   let productid=req.query.product;          
//   let sort=req.query.sort;

//   console.log("in purchases",shopId,productid,sort)
//   let options="";
//   let optionsArr=[];

//   if(shopId){
//     options=options?`${options} AND "shopId"=ANY($1::int[])` : `"shopId"=ANY($1::int[])`;
//     let shopArr=[];
//     shopArr.push(shopId);
//     optionsArr.push(shopArr);
//   } 
   
//   if(productid){    
//     let productArr=productid.split(",");    
//     options=options?`${options} AND productid=ANY($2::int[])` : `productid=ANY($1::int[])`;
//     optionsArr.push(productArr);
//   }
  
//   let sortoption="";
//   if(sort==="QtyAsc")
//     sortoption=`order by  quantity asc`;
//   if(sort==="QtyDesc")
//     sortoption=`order by  quantity desc`;
//   if(sort==="ValueAsc")
//     sortoption=`order by  quantity*price asc`;
//   if(sort==="ValueDesc")
//   sortoption=`order by  quantity*price DESC`;
  
//   let sql=`SELECT * FROM purchases ${options?"WHERE":""} ${options} ${sortoption?sortoption:""}`;
//   console.log("optionsArr=",optionsArr,"sql=",sql);
//   client.query(sql,optionsArr,function(err,result){
//     if(err) {
//       // console.log(err,"result",result);
//       // console.log("optionsArr=",optionsArr);
//       res.status(404).send("Error in fetchig data");
//     }
//     else{
//       console.log("result",result);
//       console.log("optionsArr=",optionsArr);
//       res.send(result);
//     }
//   }) 
// });