<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<div 
    class="
        absolute card bg-base-100 shadow-xl min-w-[15vw] 
        {obj.animateIn?'animate-fadeIn':''} 
        {obj.animateOut?'animate-fadeOut':''}
    " 
    style="
        {(obj.width !== undefined)?'width: ' + obj.width + '; ':''}
        {(obj.height !== undefined)?'height: ' + obj.height + '; ':''}
        {(obj.x !== undefined)?'left: ' + obj.x + '; ':''}
        {(obj.y !== undefined)?'top: ' + obj.y + '; ':''}
        {(obj.z !== undefined)?'z-index: ' + obj.z + '; ': ''} 
        {(obj.y == "0%") ? "border-top-right-radius: 0; border-top-left-radius: 0;" : ""}  
        {(obj.answer_options !== undefined && obj.answer_options.length == 1 && obj.answer_options[0].type !== undefined && obj.answer_options[0].type == 'next')?'cursor: pointer;':''}  
    " 
    on:click={(obj.answer_options !== undefined && obj.answer_options.length == 1 && obj.answer_options[0].type !== undefined && obj.answer_options[0].type == 'next')?event_callback(obj.answer_options[0], obj):undefined}
>
<div class="card-body leading-relaxed p-[3%]" 
    style="{(obj.answer_options !== undefined && obj.answer_options.length == 1 && obj.answer_options[0].type !== undefined && obj.answer_options[0].type == 'next')?'padding-right: 15%;':''}  
    {(obj.text_size !== undefined)?'font-size: ' + obj.text_size + '; ':'font-size: 1.25vw;'} 
    {(obj.text_font !== undefined)?'font-family: ' + obj.text_font + '; ':''} 
    {(obj.height !== undefined)?'max-height: 100%;':''}
    {(obj.height !== undefined)?'overflow-y: auto;' :''}
">
    <h1 class="text-center mt-5">{@html variables_in_text(obj.content)}</h1>
    {#if obj.answer_options !== undefined && obj.answer_options.length > 0}
    <div class="card-actions justify-end p-5">
    {#each obj.answer_options as a}
    {#if a.condition === undefined || evaluate_condition(a.condition)}
        {#if a.done_condition !== undefined && evaluate_condition(a.done_condition)}
            <div class="todo-item h-auto mt-4">
                <div>
                    <svg width="100%" height="100%" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                </div>
                <a class="w-full text-[1.25vw] cursor-not-allowed line-through" disabled>{@html a.content}</a>
                <p>{a.next_instruction}</p>
            </div>
        {:else if a.disabled === undefined || (a.disabled && evaluate_condition(a.disabled.condition))}
            <div class="todo-item h-auto mt-4 cursor-pointer active" on:click={(a.events !== undefined && a.events.length > 0)?event_callback(a, obj):undefined}>
                <div>
                </div>
                <a class="w-full text-[1.25vw] underline">{@html a.content}</a>
                <p>{a.next_instruction}</p>
            </div>
        {:else}
            <div class="todo-item h-auto mt-4">
                <div>
                </div>
                <a class="w-full text-[1.25vw] cursor-not-allowed" disabled>{@html a.content}</a>
                <p>{a.disabled.explanation}</p>
            </div>
        {/if}
    {/if}
    {/each}
    </div>
    {/if}   
</div>
</div>

<script lang="ts">
    export let obj = {};
    export let event_callback = undefined;
    export let variables_in_text = undefined;
    export let evaluate_condition = undefined
</script>

<style>
    .todo-item {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-column-gap: 20px;
        width: 100%;
        justify-content: center;
    }

    .todo-item a {
        color: rgb(112,112,112);
    }

    .todo-item.active a {
        color: black;
    }

    .todo-item.active:hover a {
        color: #4a00ff;
    }

    .todo-item div {
        border-radius: 100%;
        border: 2px solid rgb(220,220,220);
        height: 30px;
        width: 30px;
        margin-top: 3px;
    }

    .todo-item svg path {
        fill: rgb(147, 215, 69);
    }

    .todo-item p {
        grid-column: 2 / 3;
        color: rgb(112,112,112);
    }
</style>