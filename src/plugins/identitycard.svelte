<div class="absolute identity-card-container card card-body shadow-xl" style="
{(obj.x !== undefined)?'left: ' + obj.x + '; ':''}
{(obj.y !== undefined)?'top: ' + obj.y + '; ':''}
{(obj.width !== undefined)?'width: ' + obj.width + '; ':''}

">
    <p style="text-align: center; font-weight: bold;">{@html obj.instruction}</p>

    <div class="identity-card" style="background-image: url('{obj.background_image}');">
        <img src="{obj.avatar}" />

        <div class="id-info">
            {#if obj.edit_value_name}
                <p>
                    <b>{obj.edit_value_name}</b>
                    <input type="text" class="input input-bordered w-full max-w-full mt-[1vw]" bind:value={txt} maxlength="{obj.limit !== undefined?obj.limit:''}" />
                </p>
            {/if}

            {#each obj.key_value_pairs as k}
                <p>
                    <b>{k.key}</b><br />
                    <span>{k.value}</span>
                </p>
            {/each}
        </div>
    </div>

    {#if obj.edit_value_name}
        <button class="btn btn-primary text-[1.5vw] !h-[3vw] w-[50%] {txt == ''?'btn-disabled':''}" on:click={do_callback}>OK</button>
    {/if}
</div>

<script lang="ts">
    export let obj = {};
    export let complete_callback = undefined;
    export let load_Google_font = undefined;

    let txt = '';

    function do_callback() {
        complete_callback(obj, txt);
    }

    if (load_Google_font) {
        load_Google_font('Noto Serif Ahom');
    }
</script>

<style>
    .identity-card-container {
        display: grid;
        row-gap: 30px;
        background-color: white;
        padding: 50px;
        justify-items: center;
        border-left: 10px solid #4a00ff;
    }

    .identity-card {
        display: grid;
        grid-template-columns: 100px 1fr 1fr;
        background-color: white;
        padding: 30px;
        grid-gap: 30px;
        border: 2px solid rgb(220,220,220);
        border-radius: 10px;
        background-size: 105%;
        background-position: center;
        width: 600px;
    }

    .identity-card .id-info {
        grid-column: 2 / 4;
    }

    .identity-card p {
        padding-bottom: 10px;
    }

    .identity-card input {
        margin-bottom: 10px;
    }

    .identity-card img {
        border: 3px solid rgb(220,220,220);
        border-radius: 100%;
        background-color: rgb(245,245,245);
    }
</style>