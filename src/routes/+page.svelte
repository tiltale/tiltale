<!-- Wrapper to enforce 16:9 -->
<div class="relative w-screen h-screen bg-black flex flex-col justify-center items-center">
    {#if curr_scene !== null}
    <!-- The main story background -->
    <div class="relative max-w-[100vw] max-h-[56vw] w-[177vh] h-[100vh] overflow-hidden bg-cover bg-center" style="{(curr_scene.background !== undefined)?'background-image: url(\'/project/img/' + curr_scene.background + '\')':''}">
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
            on:click={(o.onclick !== undefined && o.onclick.length > 0)?handle_click_event(o):''}  
            />
            {/if}
        {/if}
        {/each}
    </div>    
    {/if}
</div>


<script type="ts">
    import { onMount } from "svelte";
    import story from '/project/story.json';

    let curr_scene = null;

    onMount(() => {
        // Make a copy so that we can always return to the start of the scene later.
        curr_scene = JSON.parse(JSON.stringify(story.scenes.filter(scene => { return scene.id == story.start_scene })[0]));
    });

    function handle_click_event(obj) {
        obj.onclick.forEach(function(ev) {
            console.log(ev);
            if (ev.type == 'show_object') {
                curr_scene.objects.filter(o => { return o.id == ev.target })[0].visible = true;
            }
            else if (ev.type == 'hide_object') {
                curr_scene.objects.filter(o => { return o.id == ev.target })[0].visible = false;
            }
        });

        // Force redraw
        curr_scene = curr_scene;
    }
</script>