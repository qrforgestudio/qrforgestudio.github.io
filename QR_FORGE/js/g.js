
$("file").onchange=()=>readImage($("file").files[0],img=>$("preview").innerHTML=`<img src="${img.src}" alt="Preview">`);
function removeNow(){
  readImage($("file").files[0],img=>{
    const c=document.createElement("canvas");c.width=img.width;c.height=img.height;
    const ctx=c.getContext("2d");ctx.drawImage(img,0,0);
    const d=ctx.getImageData(0,0,c.width,c.height),p=d.data,t=+$("tol").value;
    let target=[255,255,255];
    if($("mode").value=="black")target=[0,0,0];
    if($("mode").value=="color")target=$("color").value.match(/[0-9a-f]{2}/gi).map(v=>parseInt(v,16));
    const w=c.width,h=c.height,seen=new Uint8Array(w*h),queue=[];
    function add(x,y){
      if(x<0||y<0||x>=w||y>=h)return;
      const i=y*w+x,n=i*4;if(seen[i])return;
      if(Math.hypot(p[n]-target[0],p[n+1]-target[1],p[n+2]-target[2])<=t){seen[i]=1;queue.push(i)}
    }
    for(let x=0;x<w;x++){add(x,0);add(x,h-1)}
    for(let y=0;y<h;y++){add(0,y);add(w-1,y)}
    for(let k=0;k<queue.length;k++){
      const i=queue[k],x=i%w,y=Math.floor(i/w),n=i*4;p[n+3]=0;
      add(x-1,y);add(x+1,y);add(x,y-1);add(x,y+1)
    }
    ctx.putImageData(d,0,0);$("preview").innerHTML="";$("preview").appendChild(c);
    c.toBlob(b=>downloadBlob(b,"background-removed.png"))
  })
}
