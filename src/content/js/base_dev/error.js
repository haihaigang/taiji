/**
 * js报错记入服务器
 */
(function(){
    window.onerror=handleErr;
    var onerror_count=0;
    function handleErr(msg,url,l,c)
    {
        if(onerror_count>=1) return
        var data={
            message:msg,
            url:url,
            row:l,
            column:c,
            host:location.href
        }
       var html="<iframe src='/error.html' style='display: none' frameborder='0' height='0' width='0' id='iframe-error'></iframe>";
        $("body").append(html);
        var iframe=document.getElementById("iframe-error");
        var iframeDocument=iframe.contentWindow;
        iframeDocument.onload=function(){
            var form=iframeDocument.document.getElementById('inner-form')
            form.querySelector("[name=message]").value=msg;
            form.querySelector("[name=url]").value=url;
            form.querySelector("[name=row]").value=l;
            form.querySelector("[name=column]").value=c;
            form.querySelector("[name=host]").value=location.href;
            form.submit();

        }

        onerror_count++
    }
})()