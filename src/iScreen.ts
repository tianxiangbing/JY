interface IScreen{
    elem:HTMLElement;
    create(callback?:Function):HTMLElement;
    remove()
}