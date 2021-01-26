
let tree = layui.tree
let layer = layui.layer
let queryData = []
let selectData={}

function query() {
  let loading = layer.load(2, {
    shade: false,
  });
  input = document.getElementById("input").value
  console.log(input)
  queryData = input.split('\n').map(i => { return { username: i.split(" ")[0], password: i.split(" ")[1], title: null, children: [] } })
  let res = []
  for (i = 0; i < queryData.length; i++) {
    res[i] = query_1(queryData[i].username, queryData[i].password)
  }
  Promise.all(res)
    .then((a) => {
      console.log("1212", a)
      for (i = 0; i < queryData.length; i++) {
        debugger
        if (a[i].code == 0) {
          temp=[]
            for (_i=1;_i<=8;_i++){
              temp.push({ title: 'unit '+_i,id:_i })
            }
          queryData[i].title = queryData[i].username + " " + a[i].username;
          queryData[i].children = a[i].courseList.map(item => {
            return {
              title: item.textbookTitle,
              // children: [{ title: 'unit 1' }, { title: 'unit 2' }, { title: 'unit 3' }, { title: 'unit 4' }, { title: 'unit 5' }, { title: 'unit 6' }, { title: 'unit 7' }, { title: 'unit 8' }]
              children:temp
            }
          });
          queryData[i].spread = true;
        } else {
          queryData[i].title = queryData[i].username + " " + queryData[i].password + " 错误 " + (a[i].message || "")
          queryData[i].children = []
          queryData[i].disabled = true
        }
      }
      // queryData = [{ "username": "121", "password": "2121", "title": "121 2121 错误 用户名或密码错误","children": [], "disabled": true},  { "username": "s20201001","password": "123456","title": "s20201001 温家豪","children": [  {    "title": "新世界交互英语（第二版）视听说1",    "children": [      { "title": "unit 1" }, { "title": "unit 2" }, { "title": "unit 3" }, { "title": "unit 4" }, { "title": "unit 5" }, { "title": "unit 6" }, { "title": "unit 7" }, { "title": "unit 8" }    ]  }],"spread": true } ]
      console.log(queryData)
      tree.render({
        elem: '#tree',
        showCheckbox: true,
        data: queryData,
        id: "demoid"
      });
      selectData= tree.getChecked('demoid')
      layer.close(loading)
    });

  function query_1(u, p) {
    return new Promise((res) => {
      fetch("http://taotaokeji.cn/app/cmd.php?cmd=checkinfo&username=" + u + "&password=" + p).then(re => res(re.json())).catch(err => res(err))
    })
  }
}

function submit_() {

  selectData= tree.getChecked('demoid')
  console.log(selectData
    
    
    )


  // function add(a){
  //   return new Promise((res) => {
  //     fetch("http://taotaokeji.cn/app/confirmorder.php?username="+a.username+"&password="+a.password+"&xsjbookid="+a.textbookId+"&bookname="+a.textbookTitle+"&range=single&start=5&goal=8&score=99&yanzhengma=undefined&mode=putong&duration=0&oral=nan&telephone=15897339276&QQ=2102886011&message=&tip=0&orderid=XSJ20210107103674&userid=oAku2wGLD-o79FkvHfQkukVe7jBk&invitecode=undefined").then(re => res(re.json())).catch(err => res(err))
  //   })
  // }
}

function handle(){
  getData().then(res=>{
    tree.render({
      elem: '#tree',
      showCheckbox: true,
      data: res,
      id: "demoid",
      spread:true
    });
  })
}

function getData(){
  return new Promise(res=>{
    setTimeout(()=>{
      data=[
        {title:"f 1",id:"f 1",spread:true,children:[{title:'z 1',id:'z 1',spread:true ,children:[{title:'s 1',id:'s 1'},{title:'s 2',id:'s 2'}]}]},
        {title:"f 2",children:[{title:'z 1' ,children:[{title:'s 1'}]}]}
      ]
      res(data)
    },500)
  })
}

//"GET /app/confirmorder.php username=s20201513&password=123456&xsjbookid=190&bookname=%E6%96%B0%E4%B8%96%E7%95%8C%E4%BA%A4%E4%BA%92%E8%8B%B1%E8%AF%AD%EF%BC%88%E7%AC%AC%E4%BA%8C%E7%89%88%EF%BC%89%E8%A7%86%E5%90%AC%E8%AF%B41+%7C+2020%E8%83%BD%E6%BA%90%E4%B8%8E%E5%8A%A8%E5%8A%9B%E5%B7%A5%E7%A8%8B4%E7%8F%AD+-+%E6%96%B0%E4%B8%96%E7%95%8C%E8%A7%86%E5%90%AC%E8%AF%B41%EF%BC%88%E7%AC%AC2%E7%89%88%EF%BC%89&range=single&start=5&goal=8&score=99&yanzhengma=undefined&mode=putong&duration=0&oral=nan&telephone=15897339276&QQ=2102886011&message=&tip=0&orderid=XSJ20210107103674&userid=oAku2wGLD-o79FkvHfQkukVe7jBk&invitecode=undefined"