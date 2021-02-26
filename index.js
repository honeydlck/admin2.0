
let tree = layui.tree
let layer = layui.layer
let queryData = []
let selectData = {}

function query () {
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
        // debugger
        if (a[i].code == 0) {

          u = queryData[i].username
          p = queryData[i].password

          queryData[i].title = u + " " + p + " " + a[i].username;
          queryData[i].id = u + " " + p
          queryData[i].children = (a[i].courseList || []).map(item => {
            temp = []
            for (_i = 1; _i <= 8; _i++) {
              temp.push({ title: 'unit ' + _i, id: _i + " " + u + ' ' + item.textbookId })
            }
            return {
              title: item.textbookTitle,
              id: item.textbookId + " " + u,
              children: temp
            }
          });
          queryData[i].spread = true;
        } else {
          queryData[i].title = queryData[i].username + " " + queryData[i].password + " 错误 " + (a[i].message || "")
          queryData[i].id = 0
          queryData[i].children = []
          queryData[i].disabled = true
        }
      }
      // queryData = [{ "username": "121", "password": "2121", "title": "121 2121 错误 用户名或密码错误","children": [], "disabled": true},  { "username": "s20201001","password": "123456","title": "s20201001 温家豪","children": [  {    "title": "新世界交互英语（第二版）视听说1",    "children": [      { "title": "unit 1" }, { "title": "unit 2" }, { "title": "unit 3" }, { "title": "unit 4" }, { "title": "unit 5" }, { "title": "unit 6" }, { "title": "unit 7" }, { "title": "unit 8" }    ]  }],"spread": true } ]
      // console.log(queryData)

      tree.render({
        elem: '#tree',
        showCheckbox: true,
        data: queryData,
        id: "demoid"
      });
      layer.close(loading)
    });

  function query_1 (u, p) {
    return new Promise((res) => {
      fetch("http://taotaokeji.cn/app/cmd.php?cmd=checkinfo&username=" + u + "&password=" + p).then(re => res(re.json())).catch(err => res(err))
    })
  }
}

function submit_ () {

  selectData = tree.getChecked('demoid')
  console.log(selectData)
  let order = []
  debugger;
  for (i = 0; i < selectData.length; i++) {
    username = selectData[i].id.split(" ")[0]
    password = selectData[i].id.split(" ")[1]
    for (j = 0; j < selectData[i].children.length; j++) {
      bookid = selectData[i].children[j].id.split(" ")[0]
      courseName = selectData[i].children[j].title
      unitstemp = selectData[i].children[j].children.map(i => parseInt(i.id.split(" ")[0]))
      starttemp = unitstemp[0]
      for (k = 1; k < unitstemp.length; k++) {
        if (unitstemp[k] > ((unitstemp[k - 1] + 1))) {
          order.push({
            start: starttemp,
            goal: unitstemp[k - 1],
            username: username,
            password: password,
            bookid: bookid,
            courseName: courseName

          })
          starttemp = unitstemp[k]
        }
      }
      order.push({
        start: starttemp,
        goal: unitstemp[unitstemp.length - 1],
        username: username,
        password: password,
        bookid: bookid,
        courseName: courseName,
      })
      // for(k=0;k<selectData[i].children[j].children.length;k++){
      //   tempstart=selectData[i].children[j].children[0].id

      // }
    }
  }
  console.log(order)

  // function add(a){
  //   return new Promise((res) => {
  //     fetch("http://taotaokeji.cn/app/confirmorder.php?username="+a.username+"&password="+a.password+"&xsjbookid="+a.textbookId+"&bookname="+a.textbookTitle+"&range=single&start=5&goal=8&score=99&yanzhengma=undefined&mode=putong&duration=0&oral=nan&telephone=15897339276&QQ=2102886011&message=&tip=0&orderid=XSJ20210107103674&userid=oAku2wGLD-o79FkvHfQkukVe7jBk&invitecode=undefined").then(re => res(re.json())).catch(err => res(err))
  //   })
  // }
}

function handle () {
  getData().then(res => {
    tree.render({
      elem: '#tree',
      showCheckbox: true,
      data: res,
      id: "demoid",
      spread: true
    });
  })
}

function getData () {
  // return new Promise(res => {
  //   setTimeout(() => {
  //     data = [
  //       {
  //         title: "s20201212 123456 翟倬伟",
  //         id: "s20201212 123456",
  //         spread: true,
  //         children: [
  //           {
  //             title: '2018旅游管理2班',
  //             id: '180',
  //             spread: true,
  //             children: [
  //               { title: 'unit 1', id: 1 },
  //               { title: 'unit 2', id: 2 },
  //               { title: 'unit 3', id: 3 },
  //               { title: 'unit 4', id: 4 },
  //               { title: 'unit 5', id: 5 }
  //             ]
  //           }]
  //       },
  //       {
  //         title: "s20201211 123456 张三",
  //         id: "s20201211 123456",
  //         children: [
  //           {
  //             title: '视听说2',
  //             id: "180",
  //             children: [
  //               {
  //                 title: 'unit 1',
  //                 id: 'u1'
  //               }]
  //           }]
  //       }
  //     ]
  //     res(data)
  //   }, 500)
  // })
}

//"GET /app/confirmorder.php username=s20201513&password=123456&xsjbookid=190&bookname=%E6%96%B0%E4%B8%96%E7%95%8C%E4%BA%A4%E4%BA%92%E8%8B%B1%E8%AF%AD%EF%BC%88%E7%AC%AC%E4%BA%8C%E7%89%88%EF%BC%89%E8%A7%86%E5%90%AC%E8%AF%B41+%7C+2020%E8%83%BD%E6%BA%90%E4%B8%8E%E5%8A%A8%E5%8A%9B%E5%B7%A5%E7%A8%8B4%E7%8F%AD+-+%E6%96%B0%E4%B8%96%E7%95%8C%E8%A7%86%E5%90%AC%E8%AF%B41%EF%BC%88%E7%AC%AC2%E7%89%88%EF%BC%89&range=single&start=5&goal=8&score=99&yanzhengma=undefined&mode=putong&duration=0&oral=nan&telephone=15897339276&QQ=2102886011&message=&tip=0&orderid=XSJ20210107103674&userid=oAku2wGLD-o79FkvHfQkukVe7jBk&invitecode=undefined"