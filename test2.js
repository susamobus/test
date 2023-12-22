
P.getOperatorIndex=function (i,i2=0){
    if (typeof i!="number") i=Number(i);
    if (typeof i2!="number") i=Number(i2);
    if (!isFinite(i)) throw Error(invalidArgument+"Index out of range.");
    var a=this.array;
    var min=0,max=a.length-1;
    if (a[max][2]<i2) return max+0.5;
    if (a[min][2]>i2) return -0.5;
    while (min!=max){
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
    if (typeof i2!="number") i=Number(i2);
    if (typeof i3!="number") i=Number(i3);
    if (!isFinite(i)) throw Error(invalidArgument+"Index out of range.");
    var ai=this.getOperatorIndex(i,i2);
    if (Number.isInteger(ai)) return this.array[ai][i3];
    else return i===0&&i2===0?10:0;
  };
