// Object consists of a sign, layer and array
// Structure of array: [[a0, b0, c0],...] 

// c=0 represents a normal array with a and b
// (10{a})^b b0 if a0 = 0, (10{a})^b 10 otherwise

// c=1 represents a layer array 
// J_0 = 1, J_1 = J, J_2 = K, J_3 = L...
// J_a^b (normal array) if c = 0 exists within the array, J_a^b 10 otherwise



// layer++ change to
// Find subarray with c=1, a=1, b++
// If subarray does not exist, add [1,1,1] to the array

P.compareTo=P.cmp=function (other){
    if (!(other instanceof ExpantaNum)) other=new ExpantaNum(other);
    if (isNaN(this.array[0][1])||isNaN(other.array[0][1])) return NaN;
    if (this.array[0][1]==Infinity&&other.array[0][1]!=Infinity) return this.sign;
    if (this.array[0][1]!=Infinity&&other.array[0][1]==Infinity) return -other.sign;
    if (this.array.length==1&&this.array[0][1]===0&&other.array.length==1&&other.array[0][1]===0) return 0;
    if (this.sign!=other.sign) return this.sign;
    var m=this.sign;
    var r;
    if (this.layer>other.layer) r=1;
    else if (this.layer<other.layer) r=-1;
    else{
      var e,f;
      for (var i=0,l=Math.min(this.array.length,other.array.length);i<l;++i){
        e=this.array[this.array.length-1-i];
        f=other.array[other.array.length-1-i];
        if (e[2]>f[2]||e[2]==f[2]&&(e[0]>f[0]||e[0]==f[0]&&e[1]>f[1])){
          r=1;
          break;
        }else if (e[2]<f[2]||e[2]==f[2]&&(e[0]<f[0]||e[0]==f[0]&&e[1]<f[1])){
          r=-1;
          break;
        }
      }
      if (r===undefined){
        if (this.array.length==other.array.length){
          r=0;
        }else if (this.array.length>other.array.length){
          e=this.array[this.array.length-l];
          if (e[2]>=1||e[0]>10||e[1]>100){
            r=1;
          }else{
            r=-1;
          }
        }else{
          e=other.array[other.array.length-l];
          if (e[2]>=1||e[0]>10||e[1]>100){
            r=-1;
          }else{
            r=1;
          }
        }
      }
    }
    return r*m;
  };

  P.getOperatorIndex=function (i,i2=0){
    if (typeof i!="number") i=Number(i);
    if (typeof i2!="number") i2=Number(i2);
    if (!isFinite(i)||!isFinite(i2)) throw Error(invalidArgument+"Index out of range.");
    var a=this.array;
    var min=0,max=a.length-1;
    if (a[max][2]<i2||(a[max][2]==i2&&a[max][0]<i)) return max+0.5;
    if (a[min][2]>i2) return -0.5;
    while (min<=max){
      if (a[min][2]==i2&&a[min][0]==i) return min;
      if (a[max][2]==i2&&a[max][0]==i) return max;
      var mid=Math.floor((min+max)/2);
      if (min==mid||(a[mid][2]==i2&&a[mid][0]==i)){
        min=mid;
        break;
      }
      if (a[mid][2]<i2) {
          min=mid;
      }else if (a[mid][2]>i2) {
          max=mid;
      }else {
        if (a[mid][0]<i) min=mid;
        if (a[mid][0]>i) max=mid;
      }
    }
    return a[min][2]==i2&&a[min][0]==i?min:min+0.5;
  };
  P.getOperator=function (i,i2=0,i3=1){
    if (typeof i!="number") i=Number(i);
    if (typeof i2!="number") i2=Number(i2);
    if (typeof i3!="number") i3=Number(i3);
    if (!isFinite(i)) throw Error(invalidArgument+"Index out of range.");
    var ai=this.getOperatorIndex(i,i2);
    if (Number.isInteger(ai)) return this.array[ai][i3];
    else return i===0&&i2===0?10:0;
  };


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
      x.array.sort(function (a,b){return a[2]-b[2]===0?a[0]-b[0]:a[2]-b[2];});
      if (x.array.length>ExpantaNum.maxOps) x.array.splice(0,x.array.length-ExpantaNum.maxOps);
      if (!x.array.length) x.array=[[0,0,0]];

      if (x.array[x.array.length-1][2]>MAX_SAFE_INTEGER){
        x.layer++;
        x.array=[[0,x.array[x.array.length-1][2],0]];
        b=true;
      }else if (x.layer&&x.array.length==1&&x.array[0][0]===0){
        x.layer--;
        if (x.array[0][1]===0) {
          x.array=[[0,1,0]];
        } else if (x.array[0][1]===1) {
          x.array=[[0,10,0]];
        } else x.array=[[0,10,0],[1,1,Math.round(x.array[0][1])]];
        b=true;
      }
      if (x.array.length<ExpantaNum.maxOps&&x.array[0][0]!==0) x.array.unshift([0,10,0]);
      for (i=0;i<x.array.length-1;++i){
        if (x.array[i][0]==x.array[i+1][0]&&x.array[i][2]==x.array[i+1][2]){
          x.array[i][1]+=x.array[i+1][1];
          x.array.splice(i+1,1);
          --i;
          b=true;
        }
      }
      if (x.array[0][0]===0&&x.array[0][2]===0&&x.array[0][1]>MAX_SAFE_INTEGER){
        if (x.array.length>=2&&x.array[1][0]==1&&x.array[1][2]===0){
          x.array[1][1]++;
        }else{
          x.array.splice(1,0,[1,1,0]);
        }
        x.array[0][1]=Math.log10(x.array[0][1]);
        b=true;
      }
      while (x.array.length>=2&&x.array[0][0]===0&&x.array[1][0]==1&&x.array[1][1]&&x.array[1][2]>0&&x.array[0][2]===0){
        x.array[0][1]=10;
        x.array.splice(1,0,[x.array[0][1],1,x.array[1][2]-1]);
        if (x.array[2][1]>1){
          x.array[2][1]--;
        }else{
          x.array.splice(2,1);
        }
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
      if (x.array.length>=2&&x.array[0][0]===0&&x.array[1][0]!=1){
        if (x.array[0][1]) x.array.splice(1,0,[x.array[1][0]-1,x.array[0][1],x.array[1][2]]);
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
            x.array[i+1][1]++;
          }else{
            x.array.splice(i+1,0,[1,1,x.array[i][2]+1]);
          }
          if (x.array[0][0]===0&&x.array[0][2]===0){
            x.array[0][1]=x.array[i][0]+1;
          }else{
            x.array.splice(0,0,[0,x.array[i][0]+1,0]);
          }
          x.array.splice(1,i);
          b=true;
        }
      }
    }while(b);
    if (!x.array.length) x.array=[[0,0,0]];
    return x;
  };





// Planned functions to add:
// f_w2 function, Explosion, f_w^2 function, Megotion
// Respective maximum
// [1,1,2], [2,1,2], layer 1, max layers
// Inputs
// 3, 2, 3, 2

// Order: Arrow, Expansion, f_w2 function, Explosion, f_w^2 function, Megotion

  P.plus=P.add=function (other){
    var x=this.clone();
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL){
      console.log(this+"+"+other);
      if (!debugMessageSent) console.warn(expantaNumError+"Debug output via 'debug' is being deprecated and will be removed in the future!"),debugMessageSent=true;
    }
    if (x.sign==-1) return x.neg().add(other.neg()).neg();
    if (other.sign==-1) return x.sub(other.neg());
    if (x.eq(ExpantaNum.ZERO)) return other;
    if (other.eq(ExpantaNum.ZERO)) return x;
    if (x.isNaN()||other.isNaN()||x.isInfinite()&&other.isInfinite()&&x.eq(other.neg())) return ExpantaNum.NaN.clone();
    if (x.isInfinite()) return x;
    if (other.isInfinite()) return other;
    var p=x.min(other);
    var q=x.max(other);
    var op0=q.operator(0,0);
    var op1=q.operator(1,0);
    var t;
    if (q.gt(ExpantaNum.E_MAX_SAFE_INTEGER)||q.div(p).gt(ExpantaNum.MAX_SAFE_INTEGER)){
      t=q;
    }else if (!op1){
      t=new ExpantaNum(x.toNumber()+other.toNumber());
    }else if (op1==1){
      var a=p.operator(1,0)?p.operator(0,0):Math.log10(p.operator(0,0));
      t=new ExpantaNum([a+Math.log10(Math.pow(10,op0-a)+1),1,0]);
    }
    p=q=null;
    return t;
  };

P.minus=P.sub=function (other){
    var x=this.clone();
    other=new ExpantaNum(other);
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(x+"-"+other);
    if (x.sign==-1) return x.neg().sub(other.neg()).neg();
    if (other.sign==-1) return x.add(other.neg());
    if (x.eq(other)) return ExpantaNum.ZERO.clone();
    if (other.eq(ExpantaNum.ZERO)) return x;
    if (x.isNaN()||other.isNaN()||x.isInfinite()&&other.isInfinite()) return ExpantaNum.NaN.clone();
    if (x.isInfinite()) return x;
    if (other.isInfinite()) return other.neg();
    var p=x.min(other);
    var q=x.max(other);
    var n=other.gt(x);
    var op0=q.operator(0,0);
    var op1=q.operator(1,0);
    var t;
    if (q.gt(ExpantaNum.E_MAX_SAFE_INTEGER)||q.div(p).gt(ExpantaNum.MAX_SAFE_INTEGER)){
      t=q;
      t=n?t.neg():t;
    }else if (!op1){
      t=new ExpantaNum(x.toNumber()-other.toNumber());
    }else if (op1==1){
      var a=p.operator(1,0)?p.operator(0,0):Math.log10(p.operator(0,0));
      t=new ExpantaNum([a+Math.log10(Math.pow(10,op0-a)-1),1,0]);
      t=n?t.neg():t;
    }
    p=q=null;
    return t;
  };

  P.arrow=function (arrows){
    var t=this.clone();
    arrows=new ExpantaNum(arrows);
    if (!arrows.isint()||arrows.lt(ExpantaNum.ZERO)) return function(other){return ExpantaNum.NaN.clone();};
    if (arrows.eq(ExpantaNum.ZERO)) return function(other){return t.mul(other);};
    if (arrows.eq(ExpantaNum.ONE)) return function(other){return t.pow(other);};
    if (arrows.eq(2)) return function(other){return t.tetr(other);};
    return function (other){
      var depth;
      if (arguments.length==2) depth=arguments[1]; //must hide
      else depth=0;
      other=new ExpantaNum(other);
      var r;
      if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log(t+"{"+arrows+"}"+other);
    if (t.isNaN()||other.isNaN()) return ExpantaNum.NaN.clone();
      if (other.lt(ExpantaNum.ZERO)) return ExpantaNum.NaN.clone();
      if (t.eq(ExpantaNum.ZERO)){
        if (other.eq(ExpantaNum.ONE)) return ExpantaNum.ZERO.clone();
        return ExpantaNum.NaN.clone();
      }
      if (t.eq(ExpantaNum.ONE)) return ExpantaNum.ONE.clone();
      if (other.eq(ExpantaNum.ZERO)) return ExpantaNum.ONE.clone();
      if (other.eq(ExpantaNum.ONE)) return t.clone();
      if (arrows.gt(ExpantaNum.MAX_SAFE_INTEGER)){
        r=arrows.clone();
        r.setOperator(1,1,1,true);
        return r;
      }
      var arrowsNum=arrows.toNumber();
      if (other.eq(2)) return t.arrow(arrowsNum-1)(t,depth+1);
      if (t.max(other).gt("10{"+(arrowsNum+1)+"}"+MAX_SAFE_INTEGER)) return t.max(other);
      if (t.gt("10{"+arrowsNum+"}"+MAX_SAFE_INTEGER)||other.gt(ExpantaNum.MAX_SAFE_INTEGER)){
        if (t.gt("10{"+arrowsNum+"}"+MAX_SAFE_INTEGER)){
          r=t.clone();
          r.operator(arrowsNum,0,-1,true);
          r.normalize();
        }else if (t.gt("10{"+(arrowsNum-1)+"}"+MAX_SAFE_INTEGER)){
          r=new ExpantaNum(t.operator(arrowsNum-1));
        }else{
          r=ExpantaNum.ZERO;
        }
        var j=r.add(other);
        j.operator(arrowsNum,(j.operator(arrowsNum)||0)+1);
        j.normalize();
        return j;
      }
      if (depth>=ExpantaNum.maxOps+10){
        return new ExpantaNum([[0,10,0],[arrowsNum,1,0]]);
      }
      var y=other.toNumber();
      var f=Math.floor(y);
      var arrows_m1=arrows.sub(ExpantaNum.ONE);
      r=t.arrow(arrows_m1)(y-f,depth+1);
      for (var i=0,m=new ExpantaNum("10{"+(arrowsNum-1)+"}"+MAX_SAFE_INTEGER);f!==0&&r.lt(m)&&i<100;++i){
        if (f>0){
          r=t.arrow(arrows_m1)(r,depth+1);
          --f;
        }
      }
      if (i==100) f=0;
      r.operator(arrowsNum-1,(r.operator(arrowsNum-1)+f)||f);
      r.normalize();
      return r;
    };
  };



  P.expansion=function (other){
    var t=this.clone();
    other=new ExpantaNum(other);
    var r;
    if (ExpantaNum.debug>=ExpantaNum.NORMAL) console.log("{"+t+","+other+",1,2}");
    if (other.lte(ExpantaNum.ZERO)||!other.isint()) return ExpantaNum.NaN.clone();
    if (other.eq(ExpantaNum.ONE)) return t.clone();
    if (!t.isint()) return ExpantaNum.NaN.clone();
    if (t.eq(2)) return new ExpantaNum(4);
    if (other.gt(ExpantaNum.MAX_SAFE_INTEGER)) {
      // Modify 
      return other.setOperator(2,1,1,true);
    }
    var f=other.toNumber()-1;
    r=t;
    for (var i=0;f!==0&&r.lt(ExpantaNum.MAX_SAFE_INTEGER)&&i<100;++i){
      if (f>0){
        r=t.arrow(r)(t);
        --f;
      }
    }
    if (i==100) f=0;
    r.layer+=f;
    // modify above
    r.normalize();
    return r;
  };

P.setOperator=function (i,i2=0,value,increment=false){
    if (typeof i!="number") i=Number(i);
    if (typeof i2!="number") i2=Number(i2);
    if (!isFinite(i)||!isFinite(i2)) throw Error(invalidArgument+"Index out of range.");
    var ai=this.getOperatorIndex(i,i2);
    if (Number.isInteger(ai)) {
      increment?this.array[ai][1]+=value:this.array[ai][1]=value;
    }
    else{
      ai=Math.ceil(ai);
      this.array.splice(ai,0,[i,value,i2]);
    }
    this.normalize();
  };



P.toString=function (){
  if (this.sign==-1) return "-"+this.abs();
  if (isNaN(this.array[0][1])) return "NaN";
  if (!isFinite(this.array[0][1])) return "Infinity";
  var s="";
  if (!this.layer) s+="";
  else if (this.layer<3) s+="M".repeat(this.layer);
  else s+="M^"+this.layer+" ";
  for (var i=this.array.length-1;i>=0;--i){
    var e=this.array[i]
    if (e[2]>0) {
      var e2 = e[2]>1?e[2]:""
      var e0 = e[0]>1?"_"+e[2]:""
      if (e[1]<3) s+="J".repeat(e[1])+e2+e0+" ";
      else s+="J"+e2+"^"+e[1]+e0+" ";
    }else if (e[0]>1) {
      var q=e[0]>=5?"{"+e[0]+"}":"^".repeat(e[0]);
      if (e[1]>1) s+="(10"+q+")^"+e[1]+" ";
      else if (e[1]==1) s+="10"+q;
    }
  }
  var op0=this.operator(0,0);
  var op1=this.operator(1,0);
  if (!op1) s+=String(op0);
  else if (op1<3) s+="e".repeat(op1-1)+Math.pow(10,op0-Math.floor(op0))+"e"+Math.floor(op0);
  else if (op1<8) s+="e".repeat(op1)+op0;
  else s+="(10^)^"+op1+" "+op0;
  return s;
};
