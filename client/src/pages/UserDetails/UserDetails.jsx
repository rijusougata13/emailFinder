import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import styles from './styles.module.scss';
import { GlobalContext } from "../../context/searchParamContext";
import supabase from "../../config/supabaseClientConfig";
import { ContentCopy, CopyAll } from '@mui/icons-material';

export const UserDetails = () => {
  const {searchDetails,editDetails}=React.useContext(GlobalContext);
  const [loading,setLoading]=useState(false);
  const {name,linkedin,company}=searchDetails;
  const [showAddEmail,setShowAddEmail]=useState(false);
  const [newEmail,setNewEmail]=useState('');
  const [allEmails,setAllEmails]=React.useState([]);
  const [emailsVoted,setEmailsVoted]=useState(JSON.parse(localStorage.getItem('emailsVoted')));
  const fetchEmailsVoted=()=>{
    // setEmailsVoted([]);
    setEmailsVoted(JSON.parse(localStorage.getItem('emailsVoted')));
  }

  useEffect(()=>{
    if(document.getElementById("userDetails"))
    document.getElementById("userDetails").scrollIntoView({ behavior: 'smooth', block: 'end' });

  },[loading])
  useEffect(()=>{
    
    setAllEmails([]);
    setLoading(true);
    const funcApp=async()=>{
      const {data,error}=await supabase
      .from('emails')
      .select('*')
      .eq('user_id',searchDetails.id)
     
      setAllEmails(prev=>[...prev,...data]);
      setLoading(false);
    }
    if(searchDetails.id)
    funcApp();
  },[searchDetails])

  const addEmail=async()=>{
    if(!newEmail || !newEmail.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g)){
      return;
    }
    const {data:getData,error:getError}=await supabase
    .from('users')
    .select('*')
    .eq('linkedin',linkedin)
    .eq('company',JSON.stringify(company))

    if(getData.length===0){
      const {data:emailData, error:emailError}=await supabase.from('emails').insert([
        {email_id: newEmail,count:0,user_id:searchDetails.id},
      
      ]).select();
    }
    setAllEmails(prev=>[...prev,{email_id: newEmail,count:0,user_id:searchDetails.id}]);
    setShowAddEmail(false);
  }

  const vote=async(email,type)=>{
    setAllEmails(prev=>prev.map(item=>item.id===email.id?{...item,count:type==='up'?item.count+1:item.count-1}:item));
    const {data,error}=await supabase
    .from('emails')
    .update({count:type==='up'?email.count+1:email.count-1})
    .eq('id',email.id).select('*');
    localStorage.setItem("emailsVoted",localStorage.getItem('emailsVoted')?JSON.stringify([...JSON.parse(localStorage.getItem('emailsVoted')),email.id]):JSON.stringify([email.id]));
    fetchEmailsVoted();
   
   
  }
  // if(!loading && document.getElementById("userDetails"))
 
  const shortEmail=(email)=>{
    if(email.length>20){
      return email.slice(0,15)+'...';
    } 
    return email;
  }

  const copyEmail=(email)=>{
    navigator.clipboard.writeText(email);
  }
  

  if(loading){
    return <div style={{height:"10vh"}}>Loading...</div>
  }
    return (
        <div className={styles.wrapper} id="userDetails">
            <h1>User Details</h1>
            <div className={styles.details}>
            <div className={styles.textWrapper}>
              <Typography variant="h5">Name: </Typography> <Typography variant="h5">{name}</Typography>
            </div>
            <div className={styles.textWrapper}>
            <Typography variant="h5">Linkedin: </Typography> <Typography variant="h5">{linkedin}</Typography>
  </div>
              <div className={styles.textWrapper}>
              <Typography variant="h5">Company: </Typography> <Typography variant="h5">{company?.label}</Typography>
    </div>
              <div className={styles.textWrapper}>
              <Typography variant="h5">Emails Found: </Typography>
              <Button onClick={()=>setShowAddEmail(true)}>Add Email for this Profile</Button>
              </div>
              <div className={styles.textWrapper}>
              { showAddEmail && <div className={styles.addEmail}>
                <input type="text" placeholder="Enter Email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} /> <Button onClick={()=>addEmail()}>Submit</Button>
               </div>
              } 
                </div>
            <ul>
            
              {allEmails.map((email,index)=>(
                <li key={index}>
                <Typography variant="h6">{shortEmail(email.email_id)} <ContentCopy id={styles.icon} onClick={e=>copyEmail(email.email_id)}/> </Typography> <Typography variant="h6">{email.count} votes {!emailsVoted.includes(email.id)? <span><ThumbUpIcon color="primary"id={styles.icon} onClick={e=>vote(email,"up")}/>  <ThumbDownIcon onClick={e=>vote(email,"down")}  color="secondary" id={styles.icon} /></span>: <span style={{color:"green"}}
                > Already Voted</span>}</Typography> 
                </li>
              ))}
            </ul>
            </div>
          
           
        </div>
    )
}
