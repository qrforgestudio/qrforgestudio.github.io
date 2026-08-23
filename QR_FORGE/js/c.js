
$("file").onchange=()=>readImage($("file").files[0],img=>$("preview").innerHTML=`<img src="${img.src}" alt="Preview">`);
function cropNow(){
  readImage($("file").files[0],img=>{
    const x=Math.max(0,+$("x").value||0),y=Math.max(0,+$("y").value||0);
    const w=Math.min(+$("w").value||img.width,img.width-x),h=Math.min(+$("h").value||img.height,img.height-y);
    if(w<=0||h<=0)return alert("Invalid crop area.");
    const c=document.createElement("canvas");c.width=w;c.height=h;
    c.getContext("2d").drawImage(img,x,y,w,h,0,0,w,h);
    $("preview").innerHTML="";$("preview").appendChild(c);
    c.toBlob(b=>downloadBlob(b,"cropped.png"))
  })
}
