<!-- Wrapper to enforce 16:9 -->
<div class="relative w-screen h-screen bg-black flex flex-col justify-center items-center">
    {#if !is_loaded}
    <div class="relative max-w-[100vw] max-h-[56vw] w-[177vh] h-[100vh] overflow-hidden bg-cover bg-center flex flex-col items-center justify-center text-white">
        <div class="w-[15vw] animate-bounce">
            <img src="img/logo.png" />
        </div>
        <div class="text-[2vh] font-bold pt-4">Loading...</div>

        <div class="image-loader">
            {#each images as i}
            <img src="project/img/{i}" on:load={image_preloaded(i)} class="invisible" />
            {/each}
        </div>
    </div>
    {/if}
    {#if is_loaded && curr_scene !== null && scene_visible}
    <!-- The main story background -->
    <div transition:fade class="relative max-w-[100vw] max-h-[56vw] w-[177vh] h-[100vh] overflow-hidden bg-cover bg-center" style="{(curr_scene.background !== undefined)?'background-image: url(\'project/img/' + curr_scene.background + '\')':''}">

        <!-- General objects that can always be visible (e.g., UI elements) -->
        {#if story.objects !== undefined}
        {#each story.objects as o}
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
            on:click={(o.events !== undefined && o.events.length > 0)?handle_events(o):undefined}>
                {#if o.image !== undefined}
                <img src="project/img/{o.image}" draggable="false" class="w-full h-full" />
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
        <Drag obj={o} complete_callback={handle_events} />
        {/if}
        {#if o.type == 'textinput'}
        <TextInput obj={o} complete_callback={handle_events} />
        {/if}
        {#if o.type == 'phone'}
        <Phone obj={o} variables_in_text={variables_in_text} event_callback={handle_events} />
        {/if}
        {#if o.type == 'notebook'}
        <Notebook obj={o} variables_in_text={variables_in_text} txts={variables[o.content_variable]} close_callback={handle_events} />
        {/if}
        {#if o.type == 'charactercard'}
        <CharacterCard obj={o} close_callback={handle_events} />
        {/if}        
        {/if}
        {/each}
        {/if}

        {#if curr_scene.objects !== undefined}
        {#each curr_scene.objects as o}
        {#if o.visible}
            {#if o.type == 'sprite'}
            <div class="absolute {o.animateIn?'animate-fadeIn':''} {o.animateOut?'animate-fadeOut':''}" style="
            {(o.width !== undefined)?'width: ' + o.width + '; ':''}
            {(o.height !== undefined)?'height: ' + o.height + '; ':''}
            {(o.x !== undefined)?'left: ' + o.x + '; ':''}
            {(o.y !== undefined)?'top: ' + o.y + '; ':''} 
            {(o.z !== undefined)?'z-index: ' + o.z + '; ':''} 
            {(o.events !== undefined && o.events.length > 0)?'cursor: pointer; ':''}
        " 
        on:click={(o.events !== undefined && o.events.length > 0)?handle_events(o):undefined}>
            {#if o.image !== undefined}
            <img src="project/img/{o.image}" draggable="false" class="w-full h-full" />
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
            <Drag obj={o} complete_callback={handle_events} />
            {/if}
            {#if o.type == 'textinput'}
            <TextInput obj={o} complete_callback={handle_events} />
            {/if}
            {#if o.type == 'phone'}
            <Phone obj={o} variables_in_text={variables_in_text} event_callback={handle_events} />
            {/if}
            {#if o.type == 'notebook'}
            <Notebook obj={o} variables_in_text={variables_in_text} txts={variables[o.content_variable]} close_callback={handle_events} />
            {/if}
            {#if o.type == 'charactercard'}
            <CharacterCard obj={o} close_callback={handle_events} />
            {/if}            
        {/if}
        {/each}
        {/if}

        {#if curr_scene.dialogue !== undefined}
        {#each curr_scene.dialogue as d}
        {#if d.visible}
        {#if d.type !== undefined && d.type == 'thought'}
        <div class="absolute" style="z-index: 1;  
            {(d.width !== undefined)?'width: ' + d.width + '; ':''}
            {(d.height !== undefined)?'height: ' + d.height + '; ':''}
            {(d.x !== undefined)?'left: ' + d.x + '; ':''}
            {(d.y !== undefined)?'top: ' + d.y + '; ':''}
            {(d.z !== undefined)?'z-index: ' + d.z + '; ': ''} 
            {(d.answer_options !== undefined && d.answer_options.length == 1 && d.answer_options[0].type !== undefined && d.answer_options[0].type == 'next')?'cursor: pointer;':''}  
        " on:click={(d.answer_options !== undefined && d.answer_options.length == 1 && d.answer_options[0].type !== undefined && d.answer_options[0].type == 'next')?handle_events(d.answer_options[0], d):undefined}>
        <img src="img/thought_bubble.svg" class="absolute" />
        {#if d.thought_position == undefined || d.thought_position == 'bottomleft'}
        <img src="img/thought_bottomleft.svg" class="absolute top-[72%] left-[-4vw] w-[9vw]" />
        {/if}
        {#if d.thought_position !== undefined && d.thought_position == 'bottomright'}
        <img src="img/thought_bottomright.svg" class="absolute top-[72%] right-[-5vw] w-[9vw]" />
        {/if}
        {#if d.thought_position !== undefined && d.thought_position == 'topleft'}
        <img src="img/thought_topleft.svg" class="absolute top-[-5vw] left-[-4vw] w-[9vw]" />
        {/if}
        {#if d.thought_position !== undefined && d.thought_position == 'topright'}
        <img src="img/thought_topright.svg" class="absolute top-[-5vw] right-[-5vw] w-[9vw]" />
        {/if}
        <div class="leading-relaxed p-[18%] relative top-0" style="z-index: 2; 
        {(d.text_size !== undefined)?'font-size: ' + d.text_size + '; ':'font-size: 1.25vw'} 
        ">
            <p>{@html variables_in_text(d.content)}</p>
            {#if d.answer_options !== undefined && d.answer_options.length > 0}
            <br />
            <div class="card-actions justify-end mt-[-12%]">
            {#each d.answer_options as a}
            {#if a.type === undefined || a.type !== 'next'}
            <button class="btn btn-primary w-full text-[1.25vw] h-auto min-h-[4vw] mt-4" on:click={(a.events !== undefined && a.events.length > 0)?handle_events(a, d):undefined}>{@html a.content}</button>
            {/if}
            {#if a.type !== undefined && a.type == 'next'}
            <button class="btn btn-circle btn-sm bg-black hover:bg-[#5E5E5E]" on:click={(a.events !== undefined && a.events.length > 0)?handle_events(a, d):undefined}>
                <svg width="100%" height="100%" viewBox="0 0 16 16" fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" class="w-5 h-5">
                    <path d="M2,8C2,7.589 2.339,7.25 2.75,7.25L11.44,7.25L8.22,4.03C8.091,3.891 8.019,3.708 8.019,3.519C8.019,3.107 8.357,2.769 8.769,2.769C8.958,2.769 9.141,2.841 9.28,2.97L13.78,7.47C14.071,7.761 14.071,8.239 13.78,8.53L9.28,13.03C9.141,13.159 8.958,13.231 8.769,13.231C8.357,13.231 8.019,12.893 8.019,12.481C8.019,12.292 8.091,12.109 8.22,11.97L11.44,8.75L2.75,8.75C2.339,8.75 2,8.411 2,8Z" style="stroke:#ffffff;stroke-width:1.38px;"/>
                </svg>
            </button>            
            {/if}
            {/each}
            </div>
            {/if}
        </div>
        </div>        

        {:else}
        <div class="absolute card bg-base-100 shadow-xl min-w-[15vw]" style="
            {(d.width !== undefined)?'width: ' + d.width + '; ':''}
            {(d.height !== undefined)?'height: ' + d.height + '; ':''}
            {(d.x !== undefined)?'left: ' + d.x + '; ':''}
            {(d.y !== undefined)?'top: ' + d.y + '; ':''}
            {(d.z !== undefined)?'z-index: ' + d.z + '; ': ''} 
            {(d.answer_options !== undefined && d.answer_options.length == 1 && d.answer_options[0].type !== undefined && d.answer_options[0].type == 'next')?'cursor: pointer;':''}  
        " on:click={(d.answer_options !== undefined && d.answer_options.length == 1 && d.answer_options[0].type !== undefined && d.answer_options[0].type == 'next')?handle_events(d.answer_options[0], d):undefined}>
        {#if d.type !== undefined && d.type == 'speech'}
        {#if d.speech_position == undefined || d.speech_position == 'bottomleft'}
        <img src="img/speech_bottomleft.svg" class="absolute top-[100%] left-[5%] w-[2.5vw]" />
        {/if}
        {#if d.speech_position !== undefined && d.speech_position == 'bottomright'}
        <img src="img/speech_bottomright.svg" class="absolute top-[100%] right-[5%] w-[2.5vw]" />
        {/if}
        {#if d.speech_position !== undefined && d.speech_position == 'topleft'}
        <img src="img/speech_topleft.svg" class="absolute top-[-2.5vw] left-[5%] w-[2.5vw]" />
        {/if}
        {#if d.speech_position !== undefined && d.speech_position == 'topright'}
        <img src="img/speech_topright.svg" class="absolute top-[-2.5vw] right-[5%] w-[2.5vw]" />
        {/if}
        {/if}
        <div class="card-body leading-relaxed p-[5%]" 
        style="{(d.answer_options !== undefined && d.answer_options.length == 1 && d.answer_options[0].type !== undefined && d.answer_options[0].type == 'next')?'padding-right: 15%;':''}  
        {(d.text_size !== undefined)?'font-size: ' + d.text_size + '; ':'font-size: 1.25vw'} 
        ">
            {#if d.name !== undefined}
            <p class="font-bold" style="{d.name_color !== undefined?'color: ' + d.name_color + '; ':''}">{d.name}</p>
            {/if}

            <p>{@html variables_in_text(d.content)}</p>
            {#if d.answer_options !== undefined && d.answer_options.length > 0}
            {#if d.answer_options.length == 1 && d.answer_options[0].type !== undefined && d.answer_options[0].type == 'next'}            
            <button class="btn btn-circle btn-sm bg-black hover:bg-[#5E5E5E] absolute right-[6%] bottom-[6%]" on:click={(a.events !== undefined && a.events.length > 0)?handle_events(a, d):undefined}>
                <svg width="100%" height="100%" viewBox="0 0 16 16" fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" class="w-5 h-5">
                    <path d="M2,8C2,7.589 2.339,7.25 2.75,7.25L11.44,7.25L8.22,4.03C8.091,3.891 8.019,3.708 8.019,3.519C8.019,3.107 8.357,2.769 8.769,2.769C8.958,2.769 9.141,2.841 9.28,2.97L13.78,7.47C14.071,7.761 14.071,8.239 13.78,8.53L9.28,13.03C9.141,13.159 8.958,13.231 8.769,13.231C8.357,13.231 8.019,12.893 8.019,12.481C8.019,12.292 8.091,12.109 8.22,11.97L11.44,8.75L2.75,8.75C2.339,8.75 2,8.411 2,8Z" style="stroke:#ffffff;stroke-width:1.38px;"/>
                </svg>
            </button>            
            {:else}
            {#if d.content !== ''}
            <br />
            {/if}
            <div class="card-actions justify-end">
            {#each d.answer_options as a}
            {#if a.condition === undefined || evaluate_condition(a.condition)}
            <button class="btn btn-primary w-full text-[1.25vw] h-auto min-h-[4vw] mt-4" on:click={(a.events !== undefined && a.events.length > 0)?handle_events(a, d):undefined}>{@html a.content}</button>
            {/if}
            {/each}
            </div>
            {/if}
            {/if}
        </div>
        </div>        
        {/if}
        {/if}
        {/each}
        {/if}
    </div>    
    {/if}
</div>


<script type="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Drag from '../plugins/drag.svelte';
    import TextInput from '../plugins/textinput.svelte';
    import Phone from '../plugins/phone.svelte';
    import Notebook from '../plugins/notebook.svelte';
    import CharacterCard from '../plugins/charactercard.svelte';
    import story from '/project/story.json';

    let curr_scene = null;
    let scene_visible = true;
    
    let is_loaded = false;
    let images = [];
    let img_load_count = 0;

    let variables = {};

    onMount(() => {
        // Set up the preloading.
        if (story.objects !== undefined) {
            story.objects.forEach(function(obj) {
                if (obj.image !== undefined) {
                    images.push(obj.image);
                }
            });
        }

        if (story.scenes !== undefined) {
            story.scenes.forEach(function(scene) {
                if (scene.background !== undefined) {
                    images.push(scene.background);
                }

                if (scene.objects !== undefined) {
                    scene.objects.forEach(function(obj) {
                        if (obj.image !== undefined) {
                            images.push(obj.image);
                        }
                    })
                }
            })
        }

        images = images;

        // Make a copy so that we can always return to the start of the scene later.
        curr_scene = JSON.parse(JSON.stringify(story.scenes.filter(scene => { return scene.id == story.start_scene })[0]));
        handle_events(curr_scene);
    });

    function image_preloaded(img) {
        img_load_count += 1;

        if (img_load_count === images.length) {
            is_loaded = true;
        }
    }

    function variables_in_text(txt) {
        while (txt.indexOf("[") !== -1) {
            let idx = txt.indexOf("[");
            let idxend = txt.indexOf("]");
            let variable = txt.substr(idx+1, idxend - idx - 1);

            if (variables[variable] !== undefined) {
                if (variables[variable].constructor === Array) {
                    if (variables[variable].length > 1) {
                        txt = txt.replace('[' + variable + ']', variables[variable].slice(0, -1).join(', ') + ', and ' + variables[variable].slice(-1));
                    }
                    else {
                        txt = txt.replace('[' + variable + ']', variables[variable][0]);
                    }
                }
                else {
                    txt = txt.replace('[' + variable + ']', variables[variable]);
                }
            }
            else {
                txt = txt.replace('[' + variable + ']', 'undefined');
            }
        }

        return txt;
    }

    function evaluate_condition(str) {
        variables = variables;
        return eval(str);
    }

    function handle_events(obj, context = null) {
        if (obj.events === undefined) {
            return;
        }
        
        obj.events.forEach(function(ev) {
            console.log(ev);            

            if (ev.condition !== undefined && !eval(ev.condition)) {
                return;
            }
            
            if (ev.delay !== undefined) {
                setTimeout(function() { handle_event(ev, context); }, ev.delay);
            }
            else {
                handle_event(ev, context);
            }

        });
    }

    function handle_event(ev, context) {
        if (ev.type == 'show_object') {
                // Check for general / UI objects
                let objs = story.objects.filter(o => { return o.id == ev.target });
                if (objs.length == 0) {
                    // And for scene objects
                    objs = curr_scene.objects.filter(o => { return o.id == ev.target });                    
                }

                if (objs.length > 0) {
                    if (ev.animate !== undefined && ev.animate) {
                        objs[0].animateIn = true;
                        objs[0].visible = true;

                        setTimeout(function() {
                            objs[0].animateIn = false;
                        }, 600);
                    }
                    else {
                        objs[0].visible = true;
                    }
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
                if (ev.animate !== undefined && ev.animate) {
                    objs[0].animateOut = true;

                    setTimeout(function() {
                        objs[0].visible = false;
                        objs[0].animateOut = false;
                        // Force redraw
                        story.objects = story.objects;
                        curr_scene = curr_scene;                    
                    }, 400);

                }

                else {
                    setTimeout(function() {
                        objs[0].visible = false;
                        // Force redraw
                        story.objects = story.objects;
                        curr_scene = curr_scene;                    
                    }, 50);
                }
            }
        }
        else if (ev.type == 'goto_scene') {
            scene_visible = false;
            // Make a copy so that we can always return to the start of the scene later.
            curr_scene = JSON.parse(JSON.stringify(story.scenes.filter(scene => { return scene.id == ev.target })[0]));
            handle_events(curr_scene);

            setTimeout(function() {
                scene_visible = true;
            }, 500);
        }
        else if (ev.type == 'hide_dialogue') {
            let tar = curr_scene;
            if (context !== undefined && context !== null && context.dialogue !== undefined) {
                tar = context;
            }

            tar.dialogue.forEach(function(dialogue) {
                dialogue.visible = false;
            });
        }
        else if (ev.type == 'goto_dialogue') {
            let tar = curr_scene;
            if (context !== undefined && context !== null && context.dialogue !== undefined) {
                if (context.dialogue.filter(d => { return d.id == ev.target }).length > 0) {
                    tar = context;
                }
            }
            if (ev.keep_others === undefined || !ev.keep_others) {
                tar.dialogue.filter(d => { return d.visible }).forEach(function(dialogue) {
                    dialogue.visible = false;
                });
            }
            if (context !== null && context.dialogue === undefined) {
                tar.dialogue.filter(d => { return d.id == context.id })[0].visible = false;
            }

            if (ev.animate !== undefined && ev.animate) {
                let obj = tar.dialogue.filter(d => { return d.id == ev.target })[0];
                setTimeout(function() {
                    obj.visible = true;

                    // Force redraw
                    story.objects = story.objects;
                    curr_scene = curr_scene;                    
                }, 500);
            }
            else {
                tar.dialogue.filter(d => { return d.id == ev.target })[0].visible = true;
            }
        }
        else if (ev.type == 'set_variable') {
            if (ev.add !== undefined) {
                if (variables[ev.variable] === undefined) {
                    variables[ev.variable] = [];
                }
                variables[ev.variable].push(ev.add);
                variables[ev.variable] = variables[ev.variable];
            }
            else {
                variables[ev.variable] = eval(ev.value);
            }
        }

        // Force redraw
        story.objects = story.objects;
        curr_scene = curr_scene;
    }
</script>