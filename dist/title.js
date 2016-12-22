var Title=function(){function e(e){this.title=e,console.log(arguments)}return e.prototype.create=function(e){return this.elem=document.createElement("div"),this.elem.className="title",this.elem.style.position="absolute",this.elem.innerHTML=this.title,this.elem},e.prototype.remove=function(){this.elem.parentNode.removeChild(this.elem)},e}();
//# sourceMappingURL=title.js.map
