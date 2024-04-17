  <div class="absolute" style="
            {(obj.width !== undefined)?'width: ' + obj.width + '; ':''}
            {(obj.height !== undefined)?'height: ' + obj.height + '; ':''}
            {(obj.x !== undefined)?'left: ' + obj.x + '; ':''}
            {(obj.y !== undefined)?'top: ' + obj.y + '; ':''} 
        ">
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-[3vh]">
            <p><span class="italic">Build a sentence by dragging the different blocks into the designated slots!</span></p><br />
            <p class="flex flex-row gap-4">
                {#each txtarea as t}
                {#if t.type == 'text'}
                  {t.text}
                {/if}
                {#if t.type == 'slot'}
                    <div data-slotid="{t.id}" on:dragover={event => allowDrop(event)} on:drop={event => drop(event)} class="inline-block text-white flex flex-col justify-center" style="background-color: {colors[t.id].slot}; width: 40vh; height: 6vh">
                        {#if slotcontent[t.id] !== ''}
                            <div class="pointer-events-none text-center" style="background-color: {colors[t.id].text}; color: #ffffff">
                            {slotcontent[t.id]}
                            </div>
                        {/if}
                    </div>
                {/if}
                {/each}
            </p><br />
            </div>
        </div> 
        <div class="flex mt-2 gap-x-4">
        {#each obj.slots as s, index}
        <div class="card bg-base-100 shadow-xl grow">
            <div class="card-body text-[3vh]">
            {#each s.options as o}
                <div class="text-center cursor-pointer" style="background-color: {colors[index].text}; color: #ffffff" data-slotid="{index}" draggable="true" on:dragstart={event => drag(event)}>
                  {o}
                </div>
            {/each}
            </div>
        </div> 
        {/each}
        </div>       
        <div class="card bg-base-100 shadow-xl mt-2">
            <div class="card-body">
                <button class="btn btn-primary w-full text-[3vh] {slotcontent.filter(content => content == '').length > 0?'btn-disabled':''}" on:click={do_callback}>I'm done!</button>
            </div>
        </div>
  </div>

<script lang="ts">
    export let obj = {};
    export let complete_callback = undefined;

    let txtarea = [];

    let slotcontent = []; 
    let evdrag = undefined;

    let colors = [
        {
            'slot': '#F0D88E',
            'text': '#FFBF00'
        },
        {
            'slot': '#8EB7F5',
            'text': '#0065FF'
        },
        {
            'slot': '#F58EEE',
            'text': '#FA00FF'
        }
    ] 

    obj.slots.forEach(function(slot) {
        slotcontent.push('')
    });

    let tmpstr = obj.text;
    while (tmpstr.indexOf("[") !== -1) {
        let idx = tmpstr.indexOf("[");
        let idxend = tmpstr.indexOf("]");
        let slotnr = tmpstr.substr(idx+1, idxend - idx - 1);
        txtarea.push({
            'type': 'text',
            'text': tmpstr.substr(0, idx)
        });
        txtarea.push({
            'type': 'slot',
            'id': slotnr
        });

        tmpstr = tmpstr.substr(idxend+1);

        if (tmpstr.indexOf("[") == -1) {
            txtarea.push({
                'type': 'text',
                'text': tmpstr
            });
        }
    }
    
    function do_callback() {
        let res = obj.text;
        slotcontent.forEach(function(c, index) {
            res = res.replace('[' + index + ']', c);
        });

        complete_callback(obj, res);
    }

    function drag(ev) {
        console.log(ev);
        ev.dataTransfer.setData('text', ev.target.innerText);
        evdrag = ev.target;
    }

    function drop(ev) {
        if (evdrag.dataset.slotid == ev.target.dataset.slotid) {
            ev.preventDefault();
            slotcontent[ev.target.dataset.slotid] = ev.dataTransfer.getData("text");
        }
    }

    function allowDrop(ev) {
        if (evdrag.dataset.slotid == ev.target.dataset.slotid) {
            ev.preventDefault();
        }
    }
</script>