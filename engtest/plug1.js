//测试实现
//注意contobj只存储持久数据 和dom相关的不能存储
//用户数据模式{name1:text1,name2:text2}
Name = "hello";
UNameSpace = "hellodata";
this.Parse = function (tlnode, contobj) {
    dynamicscript_debug();//调用调试钩子
    var paths=new Map();//映射表 name->[paht1,path2]
    var jfun=function (node,path) {

        if(node.nodeName=='#text')
        {
            var text=node.nodeValue;
            var reg=new RegExp('{{.*}}');
            if(reg.test(text)){
                var sstext=reg.exec(text)[0];
                sstext=sstext.substring(2,sstext.length-2);
                if(!paths.has(sstext)) paths.set(sstext,[]);
                var arr=paths.get(sstext);
                arr.push(path);
                // paths.set(sstext,path);
            }

            return [true,1];//返回1代表要持续搜索下去
        }
        return [false,1];
    };
    GTlate.GenTools.Path.SearchPaths(jfun,tlnode,false);
    contobj.map=paths;
};
this.Render = function (tlnode, contobj, userdata) {
    dynamicscript_debug();
    var map=contobj.map;
    map.forEach(function (value,key) {
        if(key in userdata){
            for(var t=0;t<value.length;++t) {
                var node = GTlate.GenTools.Path.GetNodeFromPath(value[t], tlnode);
                node.nodeValue = userdata[key];
            }
        }
    });

    //以下为旧方法
    // var childs=GetAllChildren(tlnode);
    // for(var t=0;t<childs.length;++t){
    //     var node=childs[t];
    //     if(node.nodeName=='#text'&&node.nodeValue=="hello")
    //         node.nodeValue=userdata.text+userdata.num;
    // }
};