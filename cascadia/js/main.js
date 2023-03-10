
function update_input() {
  if (this.value == "" || !(parseInt(this.value) >= 0)) {
    this.value = "0"
  }
  this.value = parseInt(this.value)
  const table = document.getElementById("table-container").getElementsByTagName("table")[0]

  let num_players = count_players(table)
  console.log(num_players)

  for (let row of table.getElementsByTagName("tr")) {
    if (row.className != "vspace") {
      if (row.getElementsByClassName("bonus_output").length > 0) {
        let results;
        let outputs;
        let values = [];
        for (let inp of row.getElementsByTagName("input")) {
          values.push(parseInt(inp.value))
        }
        if (num_players == 2) {
          results = max_scoring_2players(values)
        }
        else if (num_players == 1) {
          results = max_scoring_1player(values)
        }
        else {
          results = max_scoring(values)
        }
        outputs = row.getElementsByClassName("bonus_output")
        console.assert(outputs.length == results.length)
        for (let i = 0; i < results.length; i++) {
          outputs[i].innerHTML = ("+" + results[i]).replace("+0", "")
        }
      }
    }
  }
  calculate_all(table)
  highlighter(table)
  save("auto")
}

function calculate_all(table) {
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
      if (element.classList.contains('output')) {
        element.innerHTML = intermediary_sum; intermediary_sum = 0
      }
    }
    last.innerHTML = total_sum
  }
}


function count_players(table) {
  let columns = [[],[],[],[]]

  for (let row of table.getElementsByTagName("tr")) {
    if (row.className != "vspace") {
      inps = row.querySelectorAll("input[type=number]")
      for (let i=0; i<columns.length; i++) {
        if (inps.length == columns.length) {columns[i].push(inps[i])}
      }
    }
  }
  // console.log(columns)
  let num_players = 0
  for (let col of columns) {
    let total_sum = 0
    let last = col.pop()
    for (let element of col) {
      if (element.nodeName == "INPUT") {
        total_sum += parseInt(element.value)
      }
    }
    if (total_sum > 0) {
      num_players ++
    }
  }
  return num_players
}


function highlighter(table) {
  for (let row of table.getElementsByTagName("tr")) {
    if (row.className != "vspace") {
      // Get all the <p> elements in the row
      const outputs = row.querySelectorAll('.output');

      // Initialize a variable to store the highest number
      let highest = -Infinity;

      // Initialize a variable to store the <p> element with the highest number
      let highestOutput = null;

      // Iterate through the <p> elements
      for (const output of outputs) {
        // Convert the innerHTML to a number
        const value = Number(output.innerHTML);
        // If the value is higher than the current highest, update the highest and highestOutput variables
        if (value > highest) {
          highest = value;
          highestOutput = output;
        }
      }

      // Remove the "highlight" class from all the <p> elements
      for (const output of outputs) {
        output.classList.remove('highlight');
      }

      // Initialize a variable to store the number of <p> elements with the highest number
      let highestCount = 0;

      // Iterate through the <p> elements again
      for (const output of outputs) {
        // Convert the innerHTML to a number
        const value = Number(output.innerHTML);
        // If the value is equal to the highest number, increment the highestCount variable
        if (value == highest) {
          highestCount++;
        }
      }

      // If there is only one <p> element with the highest number, add the "highlight" class to it
      if (highestCount == 1) {
        highestOutput.classList.add('highlight');
      }
    }
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

function max_scoring_2players(values) {
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
      results[idx] = 1
    }
  }
  else if (max_indices.length == 1) {
        results[max_indices[0]] = 2
  }
  return results;
}

function max_scoring_1player(values) {
  let results = [0, 0, 0, 0]
  if (JSON.stringify(results) == JSON.stringify(values)) {return results}
  for (let i = 0; i < values.length; i++) {
    if (values[i] >= 7) {results[i] = 2}
  }
  return results
}


window.onload = function () {
  const table = document.getElementById("table-container").getElementsByTagName("table")[0]
  for (let inp of table.getElementsByTagName("input")) {
    if (inp.type == "number") {
      inp.value = "0";
      inp.onchange = update_input;
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
  document.getElementById("save").onclick = function() {save(prompt("Name: ").trim())}
  document.getElementById("load").onclick = load
}


function save(name) {
  // const name = prompt("Name: ")
  if (name == null || name == "") {return;}
  const values = [];
  const inputs = document.querySelectorAll('input:not([type="button"])');
  for (const input of inputs) {values.push(input.value)}
  const bouts = document.querySelectorAll('.bonus_output');
  for (const bout of bouts) {values.push(bout.innerHTML)}
  const str = JSON.stringify(values);
  localStorage.setItem(name, str);
  // console.log(values, str)
}

function load() {

  let options = "";
  // Iterate through the keys in local storage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    options += `${key}\n`;
  }
  // Prompt the user to select a name from the options
  const name = prompt(options + "Type Del:Name to delete").trim();
  if (name == null || name == "") {return;}

  if (name.startsWith("Del:")) {
    // Get the name of the item to delete from the input string
    const deleteName = name.substring(4);
    // Check if the item exists in local storage
    if (localStorage.getItem(deleteName) !== null) {
      // If the item exists, delete it and show a confirmation message
      localStorage.removeItem(deleteName);
      alert(`Item "${deleteName}" deleted.`);
    } else {
      // If the item does not exist, show an error message
      alert(`Error: Item "${deleteName}" not found in local storage.`);
    }
    return;
  }

  const str = localStorage.getItem(name);
  if (str === null) {
    alert(`Error: Item "${name}" not found in local storage.`);
    return;
  }

  const values = JSON.parse(str);

  const inputs = document.querySelectorAll('input:not([type="button"])');
  for (let i = 0; i < inputs.length; i++) {inputs[i].value = values[i]}
  const bouts = document.querySelectorAll('.bonus_output');
  for (let i = 0; i < bouts.length; i++) {bouts[i].innerHTML = values[i+inputs.length]}
  calculate_all()
  // console.log(values, str)
}
