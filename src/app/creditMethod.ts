import { Request, Response } from 'express';
import axios from 'axios'
// const axios = require('axios')


function search_address(data){
  return axios
    .post('https://developer-test-service-2vfxwolfiq-nw.a.run.app/addresses', data )
    .then(res =>{ return res.data  })
    .catch(error => {
      console.error(error)
    })
  //
}

function search_credit(data){
  return axios
    .post('https://developer-test-service-2vfxwolfiq-nw.a.run.app/creditors', data )
    .then(res => {  return res.data;  })
    .catch(error => {
      console.error(error)
    });
}

function credit_rating(data){
  const rating = {
    total: 0, secured: 0, unsecured: 0, qualifies: false, q: 0,
  }
  data.forEach((item)=>{
    rating.total += item.value
    if(item.secured)  rating.secured += item.value
    else              rating.unsecured += item.value
    if(!item.secured)   rating.q++;
  })
  if(rating.q>=2 && rating.unsecured>500000) 
    rating.qualifies = true;
  return rating;
}

function format_address(data){
  let addr = data.address //.toLowerCase()
  if(addr.includes('Flat')){
    let flat = addr.indexOf(' ',5)+1
    return {
      address1: addr.slice(0,flat),
      address2: addr.slice(flat),
      postcode: data.postcode,
    }
  }
  else return {
    address1: data.address,
    address2: "", 
    postcode: data.postcode,
  }
}

export default async (req: Request, res: Response): Promise<void> => {
  let body = req.body
  console.log(' POST req ', body  )

  let addr = format_address(body)
  if(!addr) throw new Error(' address format error ')
  console.log(' search for addr : ', addr )
  search_address(addr)
  .then((address_res)=>{
    console.log(' Address Res : ',address_res)
    if(address_res[0] && address_res[0].id)
      return address_res[0]
    else 
      throw new Error(' no address ID ')
  })
  .then((data)=>{
    console.log(' Search credit id ', data.id )
    search_credit({
      surname:   body.surname,
      addressId: data.id
    })
    .then((credit_res)=>{
      console.log(' Credit Hist : ',credit_res )
      if(credit_res.length==0)    
        throw new Error(' Error - Empty history ')
      let rating = credit_rating(credit_res)
      console.log(' Rating ', rating)
      res.json({
        "totalCreditorValue": rating.total,
        "securedCreditorValue": rating.secured,
        "unsecuredCreditorValue": rating.unsecured,
        "qualifies": rating.qualifies
      }).end();
    })
    .catch((err)=>{
      console.log(' Error GET credit rating ',err)
      res.json({ message: `ERR- ${err}` }).end();
    })
  })
  .catch( (err)=>{ 
    console.log(' ERROR ? - ',err) 
    res.json({ message: `ERR- ${err}` }).end();
  })

};
