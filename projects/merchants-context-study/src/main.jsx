import React, {useLayoutEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './style.css';
function Preview(){
  const [scale,setScale]=useState(1);
  useLayoutEffect(()=>{
    const fit=()=>setScale(Math.min(1,window.innerWidth/1440,window.innerHeight/1024));
    fit();window.addEventListener('resize',fit);
    return ()=>window.removeEventListener('resize',fit);
  },[]);
  return <div className="preview-frame" style={{width:1440*scale,height:1024*scale}}><div className="preview-artboard" style={{transform:`scale(${scale})`}}><App/></div></div>;
}
createRoot(document.getElementById('root')).render(<Preview/>);
