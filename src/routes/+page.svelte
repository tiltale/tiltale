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
            {(o.z !== undefined)?'z-index: ' + o.z + '; ':''} 
            {(o.events !== undefined && o.events.length > 0)?'cursor: pointer; ':''}
        " 
        on:click={(o.events !== undefined && o.events.length > 0)?handle_event(o):undefined}>
            {#if o.image !== undefined}
            <img src="/project/img/{o.image}" draggable="false" />
            {/if}
            {#if o.text !== undefined}
            <div class="absolute" style=" 
            {(o.text_color !== undefined)?'color: ' + o.text_color + '; ':''}        
            {(o.text_x !== undefined)?'left: ' + o.text_x + '; ':''}
            {(o.text_y !== undefined)?'top: ' + o.text_y + '; ':''}
            {(o.text_size !== undefined)?'font-size: ' + o.text_size + '; ':''}">
                {variables_in_text(o.text)}
            </div>
            {/if}
        </div>
        {/if}
        {/each}

        {#each curr_scene.objects as o}
        {#if o.visible}
            {#if o.type == 'sprite'}
            <div class="absolute" style="
            {(o.width !== undefined)?'width: ' + o.width + '; ':''}
            {(o.height !== undefined)?'height: ' + o.height + '; ':''}
            {(o.x !== undefined)?'left: ' + o.x + '; ':''}
            {(o.y !== undefined)?'top: ' + o.y + '; ':''} 
            {(o.z !== undefined)?'z-index: ' + o.z + '; ':''} 
            {(o.events !== undefined && o.events.length > 0)?'cursor: pointer; ':''}
        " 
        on:click={(o.events !== undefined && o.events.length > 0)?handle_event(o):undefined}>
            {#if o.image !== undefined}
            <img src="/project/img/{o.image}" draggable="false" />
            {/if}
            {#if o.text !== undefined}
            <div class="absolute" style=" 
            {(o.text_color !== undefined)?'color: ' + o.text_color + '; ':''}        
            {(o.text_x !== undefined)?'left: ' + o.text_x + '; ':''}
            {(o.text_y !== undefined)?'top: ' + o.text_y + '; ':''} 
            {(o.text_size !== undefined)?'font-size: ' + o.text_size + '; ':''}">
                {variables_in_text(o.text)}
            </div>
            {/if}
            </div>
            {/if}
            {#if o.type == 'dragminigame'}
            <Drag obj={o} complete_callback={handle_event} />
            {/if}
        {/if}
        {/each}

        {#each curr_scene.dialogue as d}
        {#if d.visible}
        <div class="absolute card w-96 bg-base-100 shadow-xl" style="
            {(d.width !== undefined)?'width: ' + d.width + '; ':''}
            {(d.height !== undefined)?'height: ' + d.height + '; ':''}
            {(d.x !== undefined)?'left: ' + d.x + '; ':''}
            {(d.y !== undefined)?'top: ' + d.y + '; ':''}
            {(d.z !== undefined)?'z-index: ' + d.z + '; ': ''}">
        <div class="card-body text-[2.5vh]">
            <!--<h2 class="card-title">Shoes!</h2>-->
            <p>{@html variables_in_text(d.content)}</p>
            {#if d.answer_options.length > 0}
            <br />
            <div class="card-actions justify-end">
            {#each d.answer_options as a}
            <button class="btn btn-primary w-full" on:click={(a.events !== undefined && a.events.length > 0)?handle_event(a, d):undefined}>{a.content}</button>
            {/each}
            </div>
            {/if}
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

    let variables = {};

    onMount(() => {
        // Make a copy so that we can always return to the start of the scene later.
        curr_scene = JSON.parse(JSON.stringify(story.scenes.filter(scene => { return scene.id == story.start_scene })[0]));
        handle_event(curr_scene);
    });

    function variables_in_text(txt) {
        while (txt.indexOf("[") !== -1) {
            let idx = txt.indexOf("[");
            let idxend = txt.indexOf("]");
            let variable = txt.substr(idx+1, idxend - idx - 1);

            if (variables[variable] !== undefined) {
                txt = txt.replace('[' + variable + ']', variables[variable]);
            }
            else {
                txt = txt.replace('[' + variable + ']', 'undefined');
            }
        }

        return txt;
    }

    function handle_event(obj, context = null) {
        if (obj.events === undefined) {
            return;
        }
        
        obj.events.forEach(function(ev) {
            if (ev.condition !== undefined && !eval(ev.condition)) {
                return;
            }

            console.log(ev);
            if (ev.type == 'show_object') {
                // Check for general / UI objects
                let objs = story.objects.filter(o => { return o.id == ev.target });
                if (objs.length == 0) {
                    // And for scene objects
                    objs = curr_scene.objects.filter(o => { return o.id == ev.target });                    
                }

                if (objs.length > 0) {
                    objs[0].visible = true;
                }

            }
            else if (ev.type == 'hide_object') {
                // Check for general / UI objects
                let objs = story.objects.filter(o => { return o.id == ev.target });
                if (objs.length == 0) {
                    // And for scene objects
                    objs = curr_scene.objects.filter(o => { return o.id == ev.target });                    
                }

                if (objs.length > 0) {
                    objs[0].visible = false;
                }
            }
            else if (ev.type == 'goto_scene') {
                // Make a copy so that we can always return to the start of the scene later.
                curr_scene = JSON.parse(JSON.stringify(story.scenes.filter(scene => { return scene.id == ev.target })[0]));
                handle_event(curr_scene);
            }
            else if (ev.type == 'goto_dialogue') {
                if (ev.keep_others === undefined || !ev.keep_others) {
                    curr_scene.dialogue.filter(d => { return d.visible })[0].visible = false;
                }
                if (context !== null) {
                    curr_scene.dialogue.filter(d => { return d.id == context.id })[0].visible = false;
                }
                curr_scene.dialogue.filter(d => { return d.id == ev.target })[0].visible = true;
            }
            else if (ev.type == 'set_variable') {
                variables[ev.variable] = eval(ev.value);
            }
        });

        // Force redraw
        story.objects = story.objects;
        curr_scene = curr_scene;
    }
</script>