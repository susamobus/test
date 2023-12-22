 P.normalize=function (){
    var b;
    var x=this;
    if (ExpantaNum.debug>=ExpantaNum.ALL) console.log(x.toString());
    if (!x.array||!x.array.length) x.array=[[0,0,0]];
    if (x.sign!=1&&x.sign!=-1){
      if (typeof x.sign!="number") x.sign=Number(x.sign);
      x.sign=x.sign<0?-1:1;
    }
    if (x.layer>MAX_SAFE_INTEGER){
      x.array=[[0,Infinity,0]];
      x.layer=0;
      return x;
    }
    if (Number.isInteger(x.layer)) x.layer=Math.floor(x.layer);
    for (var i=0;i<x.array.length;++i){
      var e=x.array[i];
      if (e[0]===null||e[0]===undefined){
        e[0]=0;
      }
      if (e[0]!==0&&(e[1]===0||e[1]===null||e[1]===undefined)){
        x.array.splice(i,1);
        --i;
        continue;
      }
      if (isNaN(e[0])||isNaN(e[1])||isNaN(e[2])){
        x.array=[[0,NaN,0]];
        return x;
      }
      if (!isFinite(e[0])||!isFinite(e[1])||isNaN(e[2])){
        x.array=[[0,Infinity,0]];
        return x;
      }
      if (!Number.isInteger(e[0])) e[0]=Math.floor(e[0]);
      if (e[0]!==0&&!Number.isInteger(e[1])) e[1]=Math.floor(e[1]);
    }
    do{
      if (ExpantaNum.debug>=ExpantaNum.ALL) console.log(x.toString());
      b=false;
    // Update sorting of arrays
      x.array.sort(function (a,b){return b[2]-a[2]===0?b[0]-a[0]:b[2]-a[2];});
      if (x.array.length>ExpantaNum.maxOps) x.array.splice(0,x.array.length-ExpantaNum.maxOps);
      if (!x.array.length) x.array=[[0,0,0]];
        
      if (x.array[x.array.length-1][2]>MAX_SAFE_INTEGER){
        x.layer++;
        x.array=[[0,x.array[x.array.length-1][0],0]];
        b=true;
      }else if (x.layer&&x.array.length==1&&x.array[0][0]===0){
        x.layer--;
        if (x.array[0][1]===0) x.array=[[0,10,0]];
        else x.array=[[0,10,0],[1,1,Math.round(x.array[0][1])]];
        b=true;
      }
      if (x.array.length<ExpantaNum.maxOps&&x.array[0][0]!==0) x.array.unshift([0,10,0]);
      for (i=0;i<x.array.length-1;++i){
        if (x.array[i][0]==x.array[i+1][0]){
          x.array[i][1]+=x.array[i+1][1];
          x.array.splice(i+1,1);
          --i;
          b=true;
        }
      }
      if (x.array[0][0]===0&&x.array[0][2]===0&&x.array[0][1]>MAX_SAFE_INTEGER){
        if (x.array.length>=2&&x.array[1][0]==1){
          x.array[1][1]++;
        }else{
          x.array.splice(1,0,[1,1,0]);
        }
        x.array[0][1]=Math.log10(x.array[0][1]);
        b=true;
      }
      while (x.array.length>=2&&x.array[0][0]===0&&x.array[0][1]<MAX_E&&x.array[1][0]==1&&x.array[1][1]&&x.array[1][2]==0&&x.array[0][2]==0){
        x.array[0][1]=Math.pow(10,x.array[0][1]);
        if (x.array[1][1]>1){
          x.array[1][1]--;
        }else{
          x.array.splice(1,1);
        }
        b=true;
      }
      while (x.array.length>=2&&x.array[0][0]===0&&x.array[0][1]==1&&x.array[0][2]==0&&x.array[1][1]){
        if (x.array[1][1]>1){
          x.array[1][1]--;
        }else{
          x.array.splice(1,1);
        }
        x.array[0][1]=10;
      }
      if (x.array.length>=2&&x.array[0][0]===0&&x.array[0][2]===0&&x.array[1][0]!=1){
        if (x.array[0][1]) x.array.splice(1,0,[x.array[1][0]-1,x.array[0][1],x.array[0][2]]);
        x.array[0][1]=1;
        if (x.array[2][1]>1){
          x.array[2][1]--;
        }else{
          x.array.splice(2,1);
        }
        b=true;
      }
      for (i=1;i<x.array.length;++i){
        if (x.array[i][1]>MAX_SAFE_INTEGER){
          if (i!=x.array.length-1&&x.array[i+1][0]==x.array[i][0]+1){
            x.array[i+1][1]++;
          }else{
            x.array.splice(i+1,0,[x.array[i][0]+1,1,x.array[i][2]]);
          }
          if (x.array[0][0]===0&&x.array[0][2]===0){
            x.array[0][1]=x.array[i][1]+1;
          }else{
            x.array.splice(0,0,[0,x.array[i][1]+1,0]);
          }
          x.array.splice(1,i);
          b=true;
        }
        if (x.array[i][0]>MAX_SAFE_INTEGER){
          if (i!=x.array.length-1&&x.array[i+1][2]==x.array[i][2]+1){
            x.array[i+1][2]++;
          }else{
            x.array.splice(i+1,0,[1,1,x.array[i][2]+1]);
          }
          if (x.array[0][0]===0&&x.array[0][2]===0){
            x.array[0][1]=x.array[i][1]+1;
          }else{
            x.array.splice(0,0,[0,x.array[i][1]+1,0]);
          }
          x.array.splice(1,i);
          //Update splice here
          b=true;
        }
      }
    }while(b);
    if (!x.array.length) x.array=[[0,0,0]];
    return x;
  };
