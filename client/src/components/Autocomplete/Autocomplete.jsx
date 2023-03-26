import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import axios from 'axios';





export default function ComboBox({setCompany}) {
  const [allCompanies,setAllCompanies]=React.useState([]);
  const [searchParam,setSearchParam]=React.useState(null);
  
  React.useEffect(()=>{
    setAllCompanies(prev=>[]); 
    const funcApp=()=>{
    if(typeof searchParam === "string" && searchParam){
    axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${searchParam}'`, 
    { headers: {"Authorization" : `Bearer ${process.env.REACT_APP_CLEARBIT_API_KEY}`} },  
   ).then(res=> { setAllCompanies(prev=>[...prev,{label:res.data[0]?.name,value:res.data[0]?.domain}])});
    }
  }
    funcApp();
    
  },[searchParam])

 
  return (
    <Autocomplete
      // disablePortal
      id="combo-box-demo"
      options={allCompanies}
      onChange={(e,v)=>setCompany(v)}
      onInputChange={e=>{ setSearchParam(e.target.value)}}
      sx={{ width: 200 }} 
      renderInput={(params) => <TextField {...params} label="Company " />}
     
    />
  );
}

