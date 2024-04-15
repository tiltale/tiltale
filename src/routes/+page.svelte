<!-- Wrapper to enforce 16:9 -->
<div class="relative w-screen h-screen bg-black flex flex-col justify-center items-center">
    {#if curr_scene !== null}
    <!-- The main story background -->
    <div class="relative max-w-[100vw] max-h-[56vw] w-[177vh] h-[100vh] overflow-hidden bg-cover bg-center" style="{(curr_scene.background !== undefined)?'background-image: url(\'/project/img/' + curr_scene.background + '\')':''}">

        <!-- General objects that can always be visible (e.g., UI elements) -->
        {#each story.objects as o}
        {#if o.visible}
        <div class="absolute" style="
            {(o.width !== undefined)?'width: ' + o.width + '; ':''}
            {(o.height !== undefined)?'height: ' + o.height + '; ':''}
            {(o.x !== undefined)?'left: ' + o.x + '; ':''}
            {(o.y !== undefined)?'top: ' + o.y + '; ':''} 
            {(o.onclick !== undefined && o.onclick.length > 0)?'cursor: pointer; ':''}
        " 
        on:click={(o.onclick !== undefined && o.onclick.length > 0)?handle_click_event(o):undefined}>
            {#if o.image !== undefined}
            <img src="/project/img/{o.image}" />
            {/if}
            {#if o.text !== undefined}
            <div class="absolute text-[4vh]" style=" 
            {(o.text_color !== undefined)?'color: ' + o.text_color + '; ':''}        
            {(o.text_x !== undefined)?'left: ' + o.text_x + '; ':''}
            {(o.text_y !== undefined)?'top: ' + o.text_y + '; ':''}">
                {o.text}
            </div>
            {/if}
        </div>
        {/if}
        {/each}

        {#each curr_scene.objects as o}
        {#if o.visible}
            {#if o.type == 'sprite'}
            <img src="/project/img/{o.image}" draggable="false" class="absolute" style="
                {(o.width !== undefined)?'width: ' + o.width + '; ':''}
                {(o.height !== undefined)?'height: ' + o.height + '; ':''}
                {(o.x !== undefined)?'left: ' + o.x + '; ':''}
                {(o.y !== undefined)?'top: ' + o.y + '; ':''} 
                {(o.onclick !== undefined && o.onclick.length > 0)?'cursor: pointer; ':''}
            "
            on:click={(o.onclick !== undefined && o.onclick.length > 0)?handle_click_event(o):undefined}  
            />
            {/if}
            {#if o.type == 'dragminigame'}
            <Drag text={o.text} slots={o.slots} x={o.x} y={o.y} width={o.width} height={o.height} />
            {/if}
        {/if}
        {/each}

        {#each curr_scene.dialogue as d}
        {#if d.visible}
        <div class="card w-96 bg-base-100 shadow-xl" style="
            {(d.width !== undefined)?'width: ' + d.width + '; ':''}
            {(d.height !== undefined)?'height: ' + d.height + '; ':''}
            {(d.x !== undefined)?'left: ' + d.x + '; ':''}
            {(d.y !== undefined)?'top: ' + d.y + '; ':''}">
        <div class="card-body text-[2.5vh]">
            <!--<h2 class="card-title">Shoes!</h2>-->
            <p>{@html d.content}</p>
            <br />
            <div class="card-actions justify-end">
            {#each d.answer_options as a}
            <button class="btn btn-primary w-full" on:click={(a.onclick !== undefined && a.onclick.length > 0)?handle_click_event(a, d):undefined}>{a.content}</button>
            {/each}
            </div>
        </div>
        </div>        
        {/if}
        {/each}
    </div>    
    {/if}
</div>


<script type="ts">
    import { onMount } from "svelte";
    import Drag from '../plugins/drag.svelte';
    import story from '/project/story.json';

    let curr_scene = null;

    onMount(() => {
        // Make a copy so that we can always return to the start of the scene later.
        curr_scene = JSON.parse(JSON.stringify(story.scenes.filter(scene => { return scene.id == story.start_scene })[0]));
    });

    function handle_click_event(obj, context = null) {
        obj.onclick.forEach(function(ev) {
            console.log(ev);
            if (ev.type == 'show_object') {
                curr_scene.objects.filter(o => { return o.id == ev.target })[0].visible = true;
            }
            else if (ev.type == 'hide_object') {
                curr_scene.objects.filter(o => { return o.id == ev.target })[0].visible = false;
            }
            else if (ev.type == 'goto_scene') {
                // Make a copy so that we can always return to the start of the scene later.
                curr_scene = JSON.parse(JSON.stringify(story.scenes.filter(scene => { return scene.id == ev.target })[0]));
            }
            else if (ev.type == 'goto_dialogue') {
                context.visible = false;
                curr_scene.dialogue.filter(d => { return d.id == ev.target })[0].visible = true;
            }
        });

        // Force redraw
        curr_scene = curr_scene;
    }
</script>