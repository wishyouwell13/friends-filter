function dragstart_handler(ev) {
    //console.log("dragStart");
    // Change the source element's background color to signify drag has started

    // Set the drag's format and data. Use the event target's id for the data
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragover_handler(ev) {
    //console.log("dragOver");
    ev.preventDefault();
}

function drop_handler(ev) {
    //console.log("Drop");
    //ev.preventDefault();
    // Get the data, which is the id of the drop target
    let data = ev.dataTransfer.getData("text");
    let elemS = document.getElementById(data);

    console.log(ev.target);
    // если перетащили на UL, то добавляем элемент
    // если курсор наведен на LI или что-то другое,
    // то ищем UL и к нему добавляем эл-т
    if(ev.target.tagName == 'UL'){

        ev.target.appendChild(elemS);
    }else{
        let a = findWrap(ev.target);
        //console.log(a);
        a.appendChild(elemS);
    }

    function findWrap(source) {
        if (source.parentNode.tagName === "UL") {

            return source.parentNode;
        } else {
            return findWrap(source.parentNode);
        }
    }
    // Clear the drag data cache (for all formats/types)
    //ev.dataTransfer.clearData();
}