<div class="absolute" style="
{(obj.width !== undefined)?'width: ' + obj.width + '; ':''}
{(obj.height !== undefined)?'height: ' + obj.height + '; ':''}
{(obj.x !== undefined)?'left: ' + obj.x + '; ':''}
{(obj.y !== undefined)?'top: ' + obj.y + '; ':''} 
">
    <div class="card bg-base-100 shadow-xl" style="height: 100%;">
        <div class="card-body text-[1.5vw] leading-snug p-[5%]">
            {#if obj.global_instruction != undefined}
                <div class="pb-[3%]"><p><strong>{@html obj.global_instruction}</strong></p></div>
            {/if}

            {#if obj.questions != undefined}
                {#each obj.questions as q}
                    <div class="pb-[2%]">
                        <p class="text-left text-[1.25vw]">{@html q.question}</p>
                        <textarea type="text" class="input input-bordered w-full max-w-full mt-[1vw]" bind:value={q.value} maxlength="{obj.limit !== undefined?obj.limit:''}" on:input={update_disabled} style="resize: none;" />
                    </div> 
                {/each}
            {:else}
                <div class="pb-[2%]">
                    <p class="text-left text-[1.25vw]">{@html obj.instruction}</p>
                    <textarea type="text" class="input input-bordered w-full max-w-full mt-[1vw]" bind:value={txt} maxlength="{obj.limit !== undefined?obj.limit:''}" on:input={update_disabled} style="resize: none;" />
                </div>
            {/if}

            <div class="card-actions justify-end mt-3">
                <button class="btn btn-primary w-full text-[1.5vw] !h-[3vw] min-h-[3vw] {disabled?'btn-disabled':''}" on:click={do_callback}>{obj.button_text != undefined ? obj.button_text : "OK"}</button>
            </div>
        </div>            
    </div>
</div>

<script lang="ts">
    export let obj = {};
    export let complete_callback = undefined;

    let disabled = true;

    let txt = '';

    function update_disabled() {
        let filled_all_blanks = true;

        if (obj.questions) {
            obj.questions.forEach(q => {
                if (q.value == undefined || q.value == "") {
                    filled_all_blanks = false;
                }
            });
        } else if (txt == '') {
            filled_all_blanks = false;
            return;
        }

        disabled = !filled_all_blanks;
    }

    function do_callback() {
        if (obj.questions) {
            console.log(obj.questions)
        }

        complete_callback(obj, obj.questions ? obj.questions : txt);
    }
</script>