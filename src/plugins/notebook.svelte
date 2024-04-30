<div class="absolute" style="
{(obj.width !== undefined)?'width: ' + obj.width + '; ':''}
{(obj.height !== undefined)?'height: ' + obj.height + '; ':''}
{(obj.x !== undefined)?'left: ' + obj.x + '; ':''}
{(obj.y !== undefined)?'top: ' + obj.y + '; ':''} 
{(obj.z !== undefined)?'z-index: ' + obj.z + '; ':''} 
">
<!-- The background image -->
<div>
    <img src="img/notebook/notebook.svg" style="z-index: -1" />
</div>
<div class="absolute top-[8px] right-[32px]">
    <button class="btn btn-circle bg-black hover:bg-[#5E5E5E] border-black hover:border-[#5E5E5E] text-white" on:click={close}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
</div>
<div class="absolute p-[3%] mt-[13%] z-[1] left-[10%] overflow-y-auto text-[1vw] w-[79%] h-[84%] top-[0px]">
    {#each txts as t}
    {@html variables_in_text(t)}
    <hr />
    {/each}
</div>

</div>

<script lang="ts">
    export let obj = {};
    export let variables_in_text = undefined;
    export let close_callback = undefined;
    export let txts: string[] = [];

    function close() {
        console.log(txts);
        close_callback({
            "events": [
                {
                    "type": "hide_object",
                    "target": "notebook"
                }
            ]
        });
    }
</script>