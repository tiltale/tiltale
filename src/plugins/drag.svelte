  <div class="absolute" style="
            {(obj.width !== undefined)?'width: ' + obj.width + '; ':''}
            {(obj.height !== undefined)?'height: ' + obj.height + '; ':''}
            {(obj.x !== undefined)?'left: ' + obj.x + '; ':''}
            {(obj.y !== undefined)?'top: ' + obj.y + '; ':''} 
        ">
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-[1vw] leading-snug p-[1vw]">
            {#if obj.description === undefined}
            <p><span class="italic">Build a sentence by <span style="font-weight: bold">dragging or clicking</span> the different blocks into the designated slots!</span></p>
            {:else}
            <p><span class="italic">{@html obj.description}</span></p>
            {/if}
            <p class="flex flex-row flex-wrap gap-4 mt-[2vw]">
                {#each txtarea as t}
                {#if t.type == 'text'}
                  {@html t.text}
                {/if}
                {#if t.type == 'slot'}
                    <div data-slotid="{t.id}" on:dragover={event => allowDrop(event)} on:drop={event => drop(event)} class="inline-block text-white flex flex-col justify-center" style="background-color: {colors[t.id].slot}; min-width: 25%; min-height: 2vw">
                        {#if slotcontent[t.id] !== ''}
                            <div class="pointer-events-none flex justify-center" style="background-color: {colors[t.id].text}; color: #ffffff">
                            {@html slotcontent[t.id]}
                            </div>
                        {/if}
                    </div>
                {/if}
                {/each}
            </p>
            </div>
        </div> 
        <div class="flex mt-[2vw] gap-x-4">
        {#each obj.slots as s, index}
        <div class="card bg-base-100 shadow-xl grow min-w-[7vw]">
            <div class="card-body text-[1vw] leading-snug p-[1vw]">
            {#each s.options as o}
                <div class="flex justify-center cursor-pointer" style="background-color: {colors[index].text}; color: #ffffff; padding: 1vw" data-slotid="{index}" draggable="true" on:click={add_to_slot(index, o)} on:dragstart={event => drag(event, o)}>
                  {@html o}
                </div>
            {/each}
            </div>
        </div> 
        {/each}
        </div>       
        <div class="w-full">
                <button class="btn btn-primary w-full text-[1.5vw] !h-[4vw] min-h-[4vw] mt-4 {slotcontent.filter(content => content == '').length > 0?'btn-disabled':''}" on:click={do_callback}>I'm done!</button>
        </div>
  </div>

<script lang="ts">
    export let obj = {};
    export let complete_callback = undefined;

    let txtarea = [];

    let slotcontent = []; 
    let evdrag = undefined;
    let curr_dragtext = '';

    let colors = [
        {
            'slot': '#D87166',
            'text': '#D1312C'
        },
        {
            'slot': '#E7C084',
            'text': '#E69945'
        },
        {
            'slot': '#9CC0BA',
            'text': '#6B9DA1'
        },
        {
            'slot': '#CCAFB4',
            'text': '#AE6386'
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

    function add_to_slot(id, content) {
        slotcontent[id] = content;
    }

    function drag(ev, o) {
        console.log(ev);
        //ev.dataTransfer.setData('text', ev.target.innerHTML);
        curr_dragtext = o;
        evdrag = ev.target;
    }

    function drop(ev) {
        if (evdrag.dataset.slotid == ev.target.dataset.slotid) {
            ev.preventDefault();
            slotcontent[ev.target.dataset.slotid] = curr_dragtext;//ev.dataTransfer.getData("text");
        }
    }

    function allowDrop(ev) {
        if (evdrag.dataset.slotid == ev.target.dataset.slotid) {
            ev.preventDefault();
        }
    }
</script>