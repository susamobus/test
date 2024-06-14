

function Submit4() {
 let input = document.getElementById("input1").value
 let i = document.getElementById("input2").value
 let i2 = document.getElementById("input3").value
 let array = ProcessArray(input)
 document.getElementById("debug").innerHTML = "1"
 document.getElementById("text3").innerHTML = JSON.stringify(array)
 document.getElementById("text1").innerHTML = getOperatorIndex(array,i,i2)
}

function Submit5() {
 let input = {
  array: ProcessArray(document.getElementById("input1").value),
  layer: document.getElementById("input2").value,
 }
 document.getElementById("debug").innerHTML = "1"
 document.getElementById("text3").innerHTML = JSON.stringify(input.array)
 document.getElementById("text1").innerHTML = toString(input)
}

function toString(input){
    document.getElementById("debug").innerHTML = "2"
    if (isNaN(input.array[0][1])) return "NaN";
    if (!isFinite(input.array[0][1])) return "Infinity";
    var s="";
    if (!input.layer) s+="";
    else if (input.layer<3) s+="M".repeat(input.layer);
    else s+="M^"+input.layer+" ";
 
    document.getElementById("debug").innerHTML = "3"
    for (var i=input.array.length-1;i>=0;--i){
      var e=input.array[i]
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
    document.getElementById("debug").innerHTML = "4"
    var op0=getOperator(input,0,0);
    var op1=getOperator(input,1,0);
    document.getElementById("debug").innerHTML = "5"
    if (!op1) s+=String(op0);
    else if (op1<3) s+="e".repeat(op1-1)+Math.pow(10,op0-Math.floor(op0))+"e"+Math.floor(op0);
    else if (op1<8) s+="e".repeat(op1)+op0;
    else s+="(10^)^"+op1+" "+op0;
 
    document.getElementById("debug").innerHTML = "6"
    return s;
  };

function getOperatorIndex(array,i,i2=0){
    if (typeof i!="number") i=Number(i);
    if (typeof i2!="number") i2=Number(i2);
    var a=array;
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

function getOperator(input,i,i2=0){
    if (typeof i!="number") i=Number(i);
    if (typeof i2!="number") i2=Number(i2);
    var ai=getOperatorIndex(input.array,i,i2);
    if (Number.isInteger(ai)) return input.array[ai][1];
    else return i===0&&i2===0?10:0;
  };

  function add(other){
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
      t=new ExpantaNum([a+Math.log10(Math.pow(10,op0-a)+1),1]);
    }
    p=q=null;
    return t;
  };
