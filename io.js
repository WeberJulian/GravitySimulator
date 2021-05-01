function drop_handler(e) {
  e.preventDefault();
  var save_file = e.dataTransfer.files[0],
  reader = new FileReader();
  reader.onload = async function (event) {
    save_file = await JSON.parse(event.target.result);
    for (var i = 0; i < save_file.length; i++){
      objets.push(new Star(
        save_file[i].x, 
        save_file[i].y, 
        save_file[i].vx, 
        save_file[i].vy,
        save_file[i].stats
      ));
    }
  };
  reader.readAsText(save_file);
}

function dragstart_handler(e) {
  e.preventDefault();
}

function dragover_handler(event){
  event.preventDefault();
}
