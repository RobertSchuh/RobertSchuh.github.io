
function calculate_all() {
  if (this.value == "" || !(parseInt(this.value) >= 0)) {this.value = "0"}
  this.value = parseInt(this.value)

  if (this.parentNode.getElementsByClassName("bonus_output").length > 0) {
    let results;
    let outputs;
    let row = this.parentNode.parentNode;
    let values = [];
    for (let inp of row.getElementsByTagName("input")) {
      values.push(parseInt(inp.value))
    }
    results = max_scoring(values)
    outputs = row.getElementsByClassName("bonus_output")
    console.assert(outputs.length == results.length)
    for (let i = 0; i < results.length; i++) {
      outputs[i].innerHTML = ("+" + results[i]).replace("+0", "")
    }
  }

  const table = document.getElementById("table-container").getElementsByTagName("table")[0]
  let columns = [[],[],[],[]]

  for (let row of table.getElementsByTagName("tr")) {
    if (row.className != "vspace") {
      inps = row.querySelectorAll("input[type=number]")
      outs = row.getElementsByTagName("p")
      for (let i=0; i<columns.length; i++) {
        if (inps.length == columns.length) {columns[i].push(inps[i])}
        if (outs.length == columns.length) {columns[i].push(outs[i])}
      }
    }
  }
  // console.log(columns)
  for (let col of columns) {
    let total_sum = 0
    let intermediary_sum = 0
    let last = col.pop()
    for (let element of col) {
      let x = 0
      if (element.nodeName == "INPUT") {
        x = parseInt(element.value)
      }
      else if (element.className == "bonus_output") {
        x = parseInt("0"+element.innerHTML.replace("+",""))
      }
      total_sum += x; intermediary_sum += x
      if (element.className == "output") {
        element.innerHTML = intermediary_sum; intermediary_sum = 0
      }
    }
    last.innerHTML = total_sum
  }


}


function max_scoring(values) {
  let results = [0, 0, 0, 0]
  if (JSON.stringify(results) == JSON.stringify(values)) {return results}

  const max = Math.max.apply(null, values)
  // console.log(max)
  const max_indices = []
  for (let i = 0; i < values.length; i++) {
    if (values[i] === max) {max_indices.push(i)}
  }
  if (max_indices.length == 2) {
    for (let idx of max_indices) {
      results[idx] = 2
    }
  }
  else if (max_indices.length > 2) {
    for (let idx of max_indices) {
      results[idx] = 1
    }
  }
  else if (max_indices.length == 1) {
    results[max_indices[0]] = 3
    values[max_indices[0]] = -Infinity
    const second_max = Math.max.apply(null, values)
    const second_max_indices = []
    for (let i = 0; i < values.length; i++) {
      if (values[i] === second_max) {second_max_indices.push(i)}
    }
    if (second_max_indices.length == 1) {
      results[second_max_indices[0]] = 1
    }
  }
  return results;
}


window.onload = function () {
  const table = document.getElementById("table-container").getElementsByTagName("table")[0]
  for (let inp of table.getElementsByTagName("input")) {
    if (inp.type == "number") {
      inp.value = "0";
      inp.onchange = calculate_all;
      inp.onfocus = function() {if (this.value=="0") {this.value = ""}}
      inp.onblur = function() {if (this.value=="") {this.value = "0"}}
    }
  }
  for (let out of table.getElementsByClassName("output")) {
    out.innerHTML = "0"
  }
  for (let out of table.getElementsByClassName("bonus_output")) {
    out.innerHTML = ""
  }
}
