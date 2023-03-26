import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import supabase from '../../config/supabaseClientConfig';


import styles from './styles.module.scss';
import { Alert, AlertTitle, TextField } from '@mui/material';
import ComboBox from '../../components/Autocomplete/Autocomplete';
import { GlobalContext } from '../../context/searchParamContext';
import { UserDetails } from '../UserDetails/UserDetails';

export default function Landing() {
  const [name,setName]=React.useState('');
  const [linkedin,setLinkedin]=React.useState('');
  const [company,setCompany]=React.useState('');
  const {searchDetails,editDetails}=React.useContext(GlobalContext);
  const [showAlert,setShowAlert]=React.useState(false);
  const [alertMessage, setAlertMessage]=React.useState("");
  const [showDetails,setShowDetails]=React.useState(false);
  

  const fetchIdfromSupabase=async ()=>{
    try{
      const {data,error}=await supabase
      .from('users')
      .select('*')
      .eq('linkedin',linkedin)
      .eq('company',JSON.stringify(company))
      
      console.log("Data fetched",data)
      if(data.length===0){
        const {data:userData,error:userError}=await supabase
        .from('users')
        .insert([
          {name:name,linkedin:linkedin,company:company}
        ]).select();

        const firstName=name.split(" ")[0];
        const lastName=name.split(" ")[1];

        const {data:emailData, error:emailError}=await supabase.from('emails').insert([
          {email_id: firstName.toLowerCase()+'.'+lastName.toLowerCase()+'@'+company.value,count:0,user_id:userData[0].id},
          {email_id:firstName.toLowerCase()[0]+'.'+lastName.toLowerCase()+'@'+company.value,count:0,user_id:userData[0].id},
          {email_id:firstName.toLowerCase()+'.'+lastName.toLowerCase()[0]+'@'+company.value,count:0,user_id:userData[0].id},
          {email_id:lastName.toLowerCase()+'.'+firstName.toLowerCase()+'@'+company.value,count:0,user_id:userData[0].id},
        ]).select();
        
    setShowDetails(()=>true);
       
        return userData[0].id;
      }
        if(data[0].name !== name ){
          setShowAlert(()=>true);
          setAlertMessage("User already exists with different name ");
         
          return;
        }
      // alert("User already exists");
      console.log("data exists",data);
    setShowDetails(()=>true);

      return data[0].id;
      
    }
    catch(e){
    }
  }
  const submitHandler=async(e)=>{
    e.preventDefault();

    if(name.split(" ").length<2){
      setShowAlert(()=>true);
      setAlertMessage("Name should contain first name and last name");
      return;
    }

    if(!linkedin.match(/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([-a-zA-Z0-9]+)\/*/gm)){
      setShowAlert(()=>true);
      setAlertMessage("Please enter a valid linkedin url");
      return;
    }

    if(!company){
      setShowAlert(()=>true);
      setAlertMessage("Please select a company");
      return;
    }
    const id=await fetchIdfromSupabase();
    console.log("details",name,linkedin,company,"id",id);
    editDetails({name,linkedin,company,id});
    
  }

  // if(!showAlert && document.getElementById("userDetails")&& showDetails)
  // document.getElementById("userDetails").scrollIntoView({ behavior: 'smooth', block: 'end' });
  return (
    <Box className={styles.wrapper} sx={{ flexGrow: 1 }}>
     {showAlert && 
      <Alert severity="error" className={styles.alert} onClose={() => { setShowAlert(()=>false);}}>
        <AlertTitle>Error</AlertTitle>
        {alertMessage}
      </Alert>
      }
      <Typography variant="h4"  gutterBottom style={{color:"grey"}}> Looking for someone's email address? <br/> You have come to the right place. </Typography>
      <div className={styles.inputField}>
        <TextField id="standard-basic" label="Full Name" variant="standard"  onChange={e=>setName(e.target.value)}/>
        <TextField id="standard-basic" label="LinkedIn Profile URL" variant="standard" onChange={e=>setLinkedin(e.target.value)} />
        <ComboBox setCompany={setCompany}/>
        </div>
        <Button variant="outlined" onClick={e=>submitHandler(e)} >Submit</Button>
    </Box>
  );
}