
$("file").onchange=()=>readImage($("file").files[0],img=>$("preview").innerHTML=`<img src="${img.src}" alt="Preview">`);
function editNow(){
  readImage($("file").files[0],img=>{
    const r=+$("rotate").value,f=$("flip").value,swap=r==90||r==270;
    const c=document.createElement("canvas");c.width=swap?img.height:img.width;c.height=swap?img.width:img.height;
    const x=c.getContext("2d");x.translate(c.width/2,c.height/2);x.rotate(r*Math.PI/180);
    x.scale(f=="h"?-1:1,f=="v"?-1:1);x.drawImage(img,-img.width/2,-img.height/2);
    $("preview").innerHTML="";$("preview").appendChild(c);c.toBlob(b=>downloadBlob(b,"edited.png"))
  })
}
