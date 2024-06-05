// just-dark-chess 1.0
// 2024.6.4

let origional_board ,chesses, board, turn = 1, started, select = 0, selected = new Array(3), target = new Array(3), player1color, dead_left, deads = Array(), history;


function newgame(){  // new game button
    if (confirm("開啟新局後，目前正在進行遊戲將會重置，建議先匯出遊戲數據。是否要開啟新局？")){
        cpopup();
        init();
    }
}


function undo(){  // undo button
    let restore = history[history.length-2];
    if (restore == undefined){
        if (confirm("這是第一步棋，悔棋後棋盤會重置，是否要重新開始?")){
            init();
        }
    } else{
        history.pop();
        for (let x=0, i=0; x<4; x++){
            for (let y=0; y<8; y++){
                board[x][y] = restore[i];
                i++
            }
        }
        (turn == 1) ? turn = 2 : turn = 1;
        update();
    }
}


let content, filename;
function export_txt(){  // export the game status [generate]
    // Create file
    let ob = origional_board.map(row => row.join('')).join('');
    content = [(player1color == "black")?1:0, (started)?1:0, ob];
    history.forEach(history => {content.push(history);});
    content = content.join('');
    
    /*
    // Calculate size
    let size = content.length;
    let usebytes = true;
    if (size >= 1024){
        size = Math.round(size/1024*100)/100;
        usebytes = false;
    }
    let fix = (usebytes) ? "bytes" : "KB";
    */
   
    // Date and time
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    filename = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}.txt`;


    let blob = new Blob([content], {type:"text/plain;charset=utf-8"});
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


let player1color_tmp, started_tmp, origional_board_tmp, history_tmp, board_tmp, turn_tmp=1;
function load_txt(event){  // load the game status [preview]
    let file = event.target.files[0];
    if (file) {
        
        let load = new FileReader();
        load.onload = function (e) {
            
            content = e.target.result;
            popup(1);

            // load basics
            player1color_tmp = (content[0] == 1) ? "black" : "red";
            started_tmp = content[1];

            // load origional_board
            origional_board_tmp = [new Array(8), new Array(8), new Array(8), new Array(8)];
            for (let i=0; i<4; i++){
                for (let x=2; x<10; x++){
                    origional_board_tmp[i][x-2] = content[x+8*i];
                }
            }

            // load history
            history_tmp = new Array();
            let x = '';
            for (let i=34; i<content.length; i+=32){
                for (let j=0; j<32; j++){
                    x += content[i+j];
                }
                history_tmp.push(x);
                x = '';
            }
            
            // load current board
            board_tmp = [new Array(8), new Array(8), new Array(8), new Array(8)];
            for (let i=0; i<4; i++){
                for (let j=0; j<8; j++){
                    if (history_tmp.length == 0){
                        x = "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH"; 
                    } else{
                        x = history_tmp[history_tmp.length-1];
                    }
                    board_tmp[i][j] = x[i*8+j];
                    let show, color;
                    switch (board_tmp[i][j]){
                        case 'A': show = '將'; color = "black"; break;
                        case 'B': show = '士'; color = "black"; break;
                        case 'C': show = '象'; color = "black"; break;
                        case 'D': show = '車'; color = "black"; break;
                        case 'E': show = '馬'; color = "black"; break;
                        case 'F': show = '包'; color = "black"; break;
                        case 'G': show = '卒'; color = "black"; break;
                        case 'a': show = '帥'; color = "red"  ; break;
                        case 'b': show = '仕'; color = "red"  ; break;
                        case 'c': show = '相'; color = "red"  ; break;
                        case 'd': show = '俥'; color = "red"  ; break;
                        case 'e': show = '傌'; color = "red"  ; break;
                        case 'f': show = '炮'; color = "red"  ; break;
                        case 'g': show = '兵'; color = "red"  ; break;
                        case 'H': show = ' ' ; color = "hide" ; break;
                        case 'O': show = ' ' ; color = "none" ;
                    }
                    let index = `p${i}${j}`
                    document.getElementById(index).innerText = show;
                    switch (color){
                        case "black":
                            document.getElementById(index).style.color = "#000000";
                            document.getElementById(index).style.borderColor = "#000000";
                            document.getElementById(index).style.backgroundColor = "#666666";
                            break;
                        case "red":
                            document.getElementById(index).style.color = "#cf0000";
                            document.getElementById(index).style.borderColor = "#cf0000";
                            document.getElementById(index).style.backgroundColor = "#666666"
                            break;
                        case "hide":
                            document.getElementById(index).style.color = "#000000";
                            document.getElementById(index).style.borderColor = "#666666";
                            document.getElementById(index).style.backgroundColor = "#666666";
                            break;
                        case "none":
                            document.getElementById(index).style.borderColor = "#1d1d1d";
                            document.getElementById(index).style.backgroundColor = "#1d1d1d";
                    }
                }
            }

            // calculate red's turn or black's turn
            for (let i=0; i<history.length; i++){
                (turn_tmp == 1) ? turn_tmp = 2 : turn_tmp = 1;
            }

            document.getElementById("p1_1").innerText = `檔案名稱：${file.name}`;

        };
        load.readAsText(file);
    }    
}

function load_txt_btn(){  // load the game status [load]
    cpopup();
    player1color = player1color_tmp;
    started = started_tmp;
    origional_board = origional_board_tmp;
    history = history_tmp;
    board = board_tmp;
    turn = turn_tmp;
    update();
}


let history_i = 0;
function update_history(e){  // view history
    let t;
    switch(e){
        case 'l':
            if (history[history_i-1] != undefined){
                history_i--;
            } else{
                showtoast("⛔ 這是第一步，無法再往前");
            };
            t = history[history_i];
            break;
        case 'r':
            if (history[history_i+1] != undefined){
                history_i++
            } else{
                showtoast("⛔ 這是最後一步，無法再往後");
            }
            t = history[history_i];
            break;
        case 'n':
            history_i = (history == 0) ? 0 : history.length-1;
            if (history[history_i]){
                t = history[history_i];
            } else{
                t = "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH";
            }
            break;
        default:
            if (history[document.getElementById("p3_page").innerText-1] != undefined){
                t = history[document.getElementById("p3_page").innerText-1];
            }else{
                showtoast("⛔ 無效的輸入");
            }
    }

    
    let show, color;
    for (let i=0; i<4; i++){
        for (let j=0; j<8; j++){
            switch (t[i*8+j]){
                case 'A': show = '將'; color = "black"; break;
                case 'B': show = '士'; color = "black"; break;
                case 'C': show = '象'; color = "black"; break;
                case 'D': show = '車'; color = "black"; break;
                case 'E': show = '馬'; color = "black"; break;
                case 'F': show = '包'; color = "black"; break;
                case 'G': show = '卒'; color = "black"; break;
                case 'a': show = '帥'; color = "red"  ; break;
                case 'b': show = '仕'; color = "red"  ; break;
                case 'c': show = '相'; color = "red"  ; break;
                case 'd': show = '俥'; color = "red"  ; break;
                case 'e': show = '傌'; color = "red"  ; break;
                case 'f': show = '炮'; color = "red"  ; break;
                case 'g': show = '兵'; color = "red"  ; break;
                case 'H': show = ' ' ; color = "hide" ; break;
                case 'O': show = ' ' ; color = "none" ;
            }
            let index = `p${i}${j}`
            document.getElementById(index).innerText = show;
            switch (color){
                case "black":
                    document.getElementById(index).style.color = "#000000";
                    document.getElementById(index).style.borderColor = "#000000";
                    document.getElementById(index).style.backgroundColor = "#666666";
                    break;
                case "red":
                    document.getElementById(index).style.color = "#cf0000";
                    document.getElementById(index).style.borderColor = "#cf0000";
                    document.getElementById(index).style.backgroundColor = "#666666"
                    break;
                case "hide":
                    document.getElementById(index).style.color = "#000000";
                    document.getElementById(index).style.borderColor = "#666666";
                    document.getElementById(index).style.backgroundColor = "#666666";
                    break;
                case "none":
                    document.getElementById(index).style.borderColor = "#1d1d1d";
                    document.getElementById(index).style.backgroundColor = "#1d1d1d";
            }
        }
    }
}



function popup(page){ // opens popup
    document.getElementById("popup2").style.display = "none";
    let x;
    switch(page){  
        case 1:
            document.getElementById("p_title").innerText = "開啟檔案";
            x = document.getElementsByClassName("p2");
            for (let i=0; i<x.length; i++){x[i].style.display = "none";}
            x = document.getElementsByClassName("p3");
            for (let i=0; i<x.length; i++){x[i].style.display = "none";}
            x = document.getElementsByClassName("p1");
            for (let i=0; i<x.length; i++){x[i].style.display = "";}
            document.getElementById("popup").style.display = "block";
            break;
        case 2:
            document.getElementById("popup2").style.display = "block";
            break;
        case 3:
            document.getElementById("p_title").innerText = "歷史紀錄";
            x = document.getElementsByClassName("p1");
            for (let i=0; i<x.length; i++){x[i].style.display = "none";}
            x = document.getElementsByClassName("p2");
            for (let i=0; i<x.length; i++){x[i].style.display = "none";}
            x = document.getElementsByClassName("p3");
            for (let i=0; i<x.length; i++){x[i].style.display = "";}
            history_i = history.length;
            update_history('n');
            document.getElementById("popup").style.display = "block";
            return;
    }
    document.getElementById("overlay").style.display = "block";
    
}

function cpopup(){  // closes popup
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
    document.getElementById("popup2").style.display = "none";
}


function showtoast(message){
    let pop = document.getElementById("toast");
    pop.innerText = message;
    pop.classList.add("show");
    pop.style.animation = 'none';
    void pop.offsetWidth;
    pop.style.animation = null; 
    setTimeout(function(){
        pop.classList.remove("show");
    }, 1000);
}


function getRandom(min, max) {  // get a random int between min and max
    return Math.floor(Math.random() * (max - min) ) + min;
}

function shuffle(array, size){  // shuffles the array
    for (let i=0; i<size; i++){
        let j = getRandom(0, size-1);
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function check_next_to(row1, col1, row2, col2){  // checks if two chesses are next to each other
    if (row1 == row2 && Math.abs(col1-col2) == 1){
        return true;
    } else if (col1 == col2 && Math.abs(row1-row2) == 1){
        return true;
    } else{
        return false;
    }
}

function check_same_color(a, b){  // check if two chesses are the same color
    let al = false, bl = false;
    if (a.toLowerCase() == a){
        al = true;
    }
    if (b.toLowerCase() == b){
        bl = true;
    }
    return (al != bl) ? false : true;
}

function find_missing(a,b){  // find missing elements that are in a but not b
    a.sort();
    b.sort();
    // b array: marks 'X' (placeholder) on the elements missing
    let missing = new Array();
    for (let x=0; x<a.length; x++){  // BUG! Infinity loop!
        if (a[x] != b[x]){
            b.splice(x, 0, 'X');  // insert a placeholder
            missing.push(a[x]);
        }
    }
    return missing;
}


function update(){  // updates the chess table gui
    // update turn text
    let x;
    if (!started){
        x = "◀ 目前輪到：玩家1 (左側)";
        document.getElementById("turn").style.color = "#bbbbbb";
    } else if (turn == 1){
        if (player1color == "red"){
            x = "◀ 目前輪到：玩家1 (紅)";
            document.getElementById("turn").style.color = "#cf0000";
        } else{
            x = "◀ 目前輪到：玩家1 (黑)";
            document.getElementById("turn").style.color = "#bbbbbb";
        }
    } else {
        if (player1color == "red"){
            x = "目前輪到：玩家2 (黑) ▶";
            document.getElementById("turn").style.color = "#bbbbbb";
        } else{
            x = "目前輪到：玩家2 (紅) ▶";
            document.getElementById("turn").style.color = "#cf0000";
        }
    }
    document.getElementById("turn").innerText = x;
    
    // update all the chesses
    let show, color;
    for (let x=0; x<4; x++){
        for (let y=0; y<8; y++){
            let index = (x).toString() + (y).toString();
            switch (board[x][y]){
                case 'A': show = '將'; color = "black"; break;
                case 'B': show = '士'; color = "black"; break;
                case 'C': show = '象'; color = "black"; break;
                case 'D': show = '車'; color = "black"; break;
                case 'E': show = '馬'; color = "black"; break;
                case 'F': show = '包'; color = "black"; break;
                case 'G': show = '卒'; color = "black"; break;
                case 'a': show = '帥'; color = "red"  ; break;
                case 'b': show = '仕'; color = "red"  ; break;
                case 'c': show = '相'; color = "red"  ; break;
                case 'd': show = '俥'; color = "red"  ; break;
                case 'e': show = '傌'; color = "red"  ; break;
                case 'f': show = '炮'; color = "red"  ; break;
                case 'g': show = '兵'; color = "red"  ; break;
                case 'H': show = ' ' ; color = "hide" ; break;
                case 'O': show = ' ' ; color = "none" ;
            } 
            document.getElementById(index).innerText = show;
            switch (color){
                case "black":
                    document.getElementById(index).style.color = "#000000";
                    document.getElementById(index).style.borderColor = "#000000";
                    document.getElementById(index).style.backgroundColor = "#666666";
                    break;
                case "red":
                    document.getElementById(index).style.color = "#cf0000";
                    document.getElementById(index).style.borderColor = "#cf0000";
                    document.getElementById(index).style.backgroundColor = "#666666"
                    break;
                case "hide":
                    document.getElementById(index).style.color = "#000000";
                    document.getElementById(index).style.borderColor = "#666666";
                    document.getElementById(index).style.backgroundColor = "#666666";
                    break;
                case "none":
                    document.getElementById(index).style.borderColor = "#1d1d1d";
                    document.getElementById(index).style.backgroundColor = "#1d1d1d";
            }
        }
    }

    // update dead list
    let alive = new Array();
    for (let x=0; x<4; x++){
        for (let y=0; y<8; y++){
            if(board[x][y] != 'O'){
                alive.push((board[x][y] == 'H') ? origional_board[x][y] : board[x][y]);
            }
        }
    }
    alive.sort();
    deads = find_missing(chesses, alive);
    let dl = 0, dr = 0;
    for (let x=0; x<8; x++){
        document.getElementById(`dl${x}`).innerText = "";
        document.getElementById(`dr${x}`).innerText = "";
    }

    let a = document.getElementsByClassName("dead");
    for (let i=0; i<a.length; a++){
        a[i].style.border = "0px";
        a[i].style.background = "#2d2d2d";
    }

    for (let i=0; i<15; i++){
        document.getElementById(`dl${i}`).innerText = "";
        document.getElementById(`dl${i}`).style.border = "0px";
        document.getElementById(`dl${i}`).style.background = "none";
        document.getElementById(`dr${i}`).innerText = "";
        document.getElementById(`dr${i}`).style.border = "0px";
        document.getElementById(`dr${i}`).style.background = "none";
    }

    for (let x=0; x<deads.length; x++){
        switch (deads[x]){
            case 'A': show = '將'; color = "black"; break;
            case 'B': show = '士'; color = "black"; break;
            case 'C': show = '象'; color = "black"; break;
            case 'D': show = '車'; color = "black"; break;
            case 'E': show = '馬'; color = "black"; break;
            case 'F': show = '包'; color = "black"; break;
            case 'G': show = '卒'; color = "black"; break;
            case 'a': show = '帥'; color = "red"  ; break;
            case 'b': show = '仕'; color = "red"  ; break;
            case 'c': show = '相'; color = "red"  ; break;
            case 'd': show = '俥'; color = "red"  ; break;
            case 'e': show = '傌'; color = "red"  ; break;
            case 'f': show = '炮'; color = "red"  ; break;
            case 'g': show = '兵'; color = "red"  ;
        }
        let y, id;
        if (color == dead_left){
            id = (dead_left == "black")?`dl${x}`:`dr${x-dl}`
            y = document.getElementById(id);
            if (dead_left == "black"){
                y.innerText = show;
                dl++;
            }else {
                y.innerText = show;
                dr++;
            }
        } else{
            id = (dead_left == "black")?`dr${x-dl}`:`dl${x}`
            y = document.getElementById(id);
            if (dead_left == "black"){
                y.innerText = show;
                dr++;
            }else {
                y.innerText = show;
                dl++;
            }
        }
        // y.style.display = "";
        y.style.color = (color == "black") ? "#000000": "#cf0000";
        y.style.border = (color == "black") ? "#000000 3px solid": "#ff0000 3px solid";
        y.style.background = "#666666";
    }


    // selected chess highlight
    let b = document.getElementsByClassName('b');
    for (let i=0; i<b.length; i++){
        b[i].style.backgroundColor = "#1d1d1d";
    }
    if (selected[1] != undefined && selected[2] != undefined){
        index = "b" + (selected[1]).toString() + (selected[2]).toString();
        document.getElementById(index).style.backgroundColor = "#999999";
    }


    // win detection
    let red = 0, black = 0;
    for (let i=0; i<deads.length; i++){
        if (deads[i].toLowerCase() == deads[i]){
            red++;
        }
        if (deads[i].toUpperCase() == deads[i]){
            black++;
        }
    }
    if (black == 16){
        document.getElementById("turn").innerText = player1color == "black" ? "玩家1(黑色) 獲勝!" : "玩家2(黑色) 獲勝!";
        document.getElementById("turn").style.color = "#bbbbbb"
    }
    if (red == 16){
        document.getElementById("turn").innerText = player1color == "red" ? "玩家1(紅色) 獲勝!" : "玩家2(紅色) 獲勝!";
        document.getElementById("turn").style.color = "#cf0000";
    }
    console.log(black,red);


}


function switch_turn(){  // black's turn <--> red's turn
    
    // switch turn
    board[selected[1]][selected[2]] = 'O';
    board[target[1]][target[2]] = selected[0];
    (turn == 1) ? turn = 2 : turn = 1;

    // update history
    history_tmp = '';
    for (let i=0; i<4; i++){
        for (let j=0; j<8; j++){
            history_tmp += board[i][j];
        }
    }
    history.push(history_tmp);

    // clear selection
    selected[0] = selected[1] = selected[2] = target[0] = target[1] = target[2] = undefined;
}


function press(rol, col){  // clicking chess detection and eating detection
    
    function reselect(){
        if (board[rol][col] == 'O'){  // select none
            return;
        }
        if ((board[rol][col] == board[rol][col].toLowerCase() && turn == 1 && player1color == "black") ||
            (board[rol][col] == board[rol][col].toLowerCase() && turn == 2 && player1color == "red")   ||
            (board[rol][col] == board[rol][col].toUpperCase() && turn == 1 && player1color == "red")   ||
            (board[rol][col] == board[rol][col].toUpperCase() && turn == 2 && player1color == "black") ){
            // line 1: current = red, turn = 1(black)
            // line 2: current = red, turn = 2(black)
            // line 3: current = black, turn = 1(red)
            // line 4: current = black, turn = 2(red)

            if (arguments[0] != 1){
                showtoast("⚠️ 顏色錯誤!");
            }
            select = 1;
            return;
        }
        select = 1;
        selected[0] = board[rol][col];
        selected[1] = rol;
        selected[2] = col;
        update();
    }
    
    /* First movement -> determine color */
    if (!started){
        started = true;
        if (origional_board[rol][col] == (origional_board[rol][col]).toLowerCase()){  // lower case = red
            // player1 = red
            player1color = "red";
            dead_left = "black";
        } else{
            // player1 = black
            player1color = "black";
            dead_left = "red";
        }
        board[rol][col] = origional_board[rol][col];
        (turn == 1) ? turn = 2 : turn = 1;
        history_tmp = '';
        for (let i=0; i<4; i++){
            for (let j=0; j<8; j++){
                history_tmp += board[i][j];
            }
        }
        history.push(history_tmp);
        update();
        return;
    }

    /* Register pressed chesses */
    if (board[rol][col] == 'H'){  // flip covered
        board[rol][col] = origional_board[rol][col];
        (turn == 1) ? turn = 2 : turn = 1;
        history_tmp = '';
        for (let i=0; i<4; i++){
            for (let j=0; j<8; j++){
                history_tmp += board[i][j];
            }
        }
        history.push(history_tmp);
        select = 0;
        selected[0] = selected[1] = selected[2] = target[0] = target[1] = target[2] = undefined;
        update();
        return;
    } else{
        if (select == 0){
            reselect();
        } else{  //select = 1 (selected something before)
            
            if (rol == selected[1] && col == selected[2]){  // cancel select
                select = 0;
                selected[0] = selected[1] = selected[2] = undefined;
                update();
                return;
            }

            target[0] = board[rol][col];
            target[1] = rol;
            target[2] = col;


            // select wrong color for the second time make selected[0] undefined, stop here to prevent bug
            if (selected[0] == undefined){
                reselect();
                select = 0;
                return;
            }

            /* chess detection */
            if (selected[0].toUpperCase() == 'F'){  // f: jumping detection
                
                // vertical jump or horizontal jump
                let detection = new Array(8);
                let count = 0;
                if (selected[1] == target[1]){
                    // horizontal jump -> same row
                    for (let i=0; i<8; i++){
                        detection[i] = board[target[1]][i];
                    }
                    if (selected[2] < target[2]){  // horizontal right
                        for (let i=selected[2]+1; i<target[2]; i++){
                            if (detection[i] != 'O'){
                                count++;
                            }
                        }
                    } else{  // horizontal left
                        for (let i=selected[2]-1; i>target[2]; i--){
                            if (detection[i] != 'O'){
                                count++;
                            }
                        }
                    }
                } else if (selected[2] == target[2]){
                    // vertical jump -> same column
                    for (let i=0; i<4; i++){
                        detection[i] = board[i][target[2]];
                    }
                    if (selected[1] < target[1]){  // vertical down
                        for (let i=selected[1]+1; i<target[1]; i++){
                            if (detection[i] != 'O'){
                                count++;
                            }
                        }
                    } else{  // vertical up
                        for (let i=selected[1]-1; i>target[1]; i--){
                            if (detection[i] != 'O'){
                                count++;
                            }
                        }
                    }
                } else{
                    reselect();
                }
                if (count == 1){
                    // f jumps successfully
                    if (!(check_same_color(selected[0], target[0]))){
                        switch_turn();
                        update();
                    } else{
                        reselect();
                    }
                } else if (count == 0){
                    // f moves
                    if (target[0] == 'O' && check_next_to(selected[1], selected[2], target[1], target[2])){
                        switch_turn();
                        update();
                    }else{
                        if (!(check_same_color(selected[0], target[0]))){
                            showtoast("⚠️ 您所選擇的棋不能這樣吃!");
                            reselect(1);
                        }else{
                            reselect();
                        }
                    }
                } else{
                    if (!(check_same_color(selected[0], target[0]))){
                        showtoast("⚠️ 您所選擇的棋不能這樣吃!");
                        reselect(1);
                    }else{
                        reselect();
                    }
                }

            } else{ // others: detect if selected is next to selected2
                
                if (check_next_to(selected[1], selected[2], target[1], target[2])){
                    // regulary move
                    if (target[0] == 'O'){
                        switch_turn();
                        update();
                    }
                    // rule 1: g can eat a
                    else if (selected[0].toUpperCase() == 'G' && target[0].toUpperCase() == 'A'){
                        if (!(check_same_color(selected[0], target[0]))){
                            switch_turn();
                            update();
                        } else{
                            reselect();
                        }
                    }
                    // rule 2: big eat small (G>F>E>D>B>C>A in js)
                    else if (selected[0].toUpperCase() <= target[0].toUpperCase()){
                        if (!(selected[0].toUpperCase() == 'A' && target[0].toUpperCase() == 'G')){
                            if (!(check_same_color(selected[0], target[0]))){
                                switch_turn();
                                update();
                            } else{
                                reselect();
                            }
                        } else{
                            if (!(check_same_color(selected[0], target[0]))){
                                showtoast("⚠️ 您所選擇的棋不能這樣吃!");
                                reselect(1);
                                return;
                            }else{
                                reselect();
                            }
                        }  
                    }
                    // othes: cannot eat
                    else{
                        if (!(check_same_color(selected[0], target[0]))){
                            showtoast("⚠️ 您所選擇的棋不能這樣吃!");
                            reselect(1);
                            return;
                        }else{
                            reselect();
                        }
                    }
                } else{
                    reselect();
                    return;
                }
            }
            select = 0;
        }
    }
}


function init(){  // initialization
    
    // shuffle
    chesses = "ABBCCDDEEFFGGGGGabbccddeeffggggg".split('');
    origional_board = [new Array(8), new Array(8), new Array(8), new Array(8)];
    board = [['H','H','H','H','H','H','H','H'],['H','H','H','H','H','H','H','H'],['H','H','H','H','H','H','H','H'],['H','H','H','H','H','H','H','H']];
    shuffle(chesses, 32);
    
    // place
    for (let i=0, x=0; i<4; i++){
        for (let j=0; j<8; j++){
            origional_board[i][j] = chesses[x];
            x++;
        }
    }

    // start
    turn = 1;
    player1color = "red";
    dead_left = "red";
    started = false;
    select = 0;
    selected = new Array(3);   // [chess, rol, col]
    target = new Array(3);  // ex: ['A', 1, 1]
    history = new Array();
    deads = new Array();
    history_i = 0;
    update();
}

document.addEventListener("DOMContentLoaded", function(){  // runs init() after page loaded
    init();
});

document.addEventListener('keydown', function(event){  // key binds
    
    // Ctrl/Command + Z -> undo
    if ((event.ctrlKey || event.metaKey) && event.key == 'z') {
        undo();
    }
    
    // F2 -> new game
    if (event.key == 'F2') {
        newgame();
    }

    // Ctrl/Command + S -> save
    if ((event.ctrlKey || event.metaKey) && event.key == 's') {
        export_txt();
    }
});

document.getElementById("load_i").addEventListener("change", load_txt);  // load txt trigger