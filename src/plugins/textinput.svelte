<div class="absolute" style="
{(obj.width !== undefined)?'width: ' + obj.width + '; ':''}
{(obj.height !== undefined)?'height: ' + obj.height + '; ':''}
{(obj.x !== undefined)?'left: ' + obj.x + '; ':''}
{(obj.y !== undefined)?'top: ' + obj.y + '; ':''} 
">
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body text-[1.5vw] leading-snug p-[5%]">
            <p>{@html obj.instruction}</p>
            <input type="text" class="input input-bordered w-full max-w-xs mt-[1vw]" bind:value={txt} />
        </div>

        <div class="card-actions justify-end">
            <button class="btn btn-primary w-full text-[1.5vw] !h-[4vw] min-h-[4vw] mt-4 {txt == ''?'btn-disabled':''}" on:click={do_callback}>OK</button>
        </div>
    </div>
</div>

<script lang="ts">
    export let obj = {};
    export let complete_callback = undefined;

    let txt = '';

    function do_callback() {
        complete_callback(obj, txt);
    }
    

</script>