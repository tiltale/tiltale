<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<script lang="ts">
    import { onMount } from "svelte";
    export let obj = {};
    export let variables_in_text = undefined;
    export let event_callback = undefined;
    let prev_obj = {};
    let typing_id = "";
    let last_id = "";
    let last_avatar_id = "";
    let container: HTMLElement;

    let is_scrolled = false;

    let timers = [];

    function callback_event_and_cancel_timer(answer_option, dialogue) {
        if (timers[timers.findIndex(t => t.id == dialogue.id)]) {
            timers[timers.findIndex(t => t.id == dialogue.id)].canceled = true;
        }

        event_callback(answer_option);
    }

    $: {
        console.log(prev_obj);
        if (Object.keys(prev_obj).length > 0) {
            let new_texts = obj.objects.filter((o) => {
                return o.id == "texts";
            })[0];
            let old_texts = prev_obj.objects.filter((o) => {
                return o.id == "texts";
            })[0];

            if (new_texts !== undefined && old_texts !== undefined) {
                for (let d of new_texts.dialogue) {
                    let old_d = old_texts.dialogue.filter((od) => {
                        return od.id == d.id;
                    })[0];

                    if (old_d.visible !== d.visible) {
                        typing_id = d.id;
                        last_id = typing_id;
                        last_avatar_id = d.avatar_id;

                        setTimeout(function () {
                            if (!is_scrolled) {
                                container.scrollTop = container.scrollHeight;
                            }
                        }, 50);

                        setTimeout(function () {
                            typing_id = "";

                            setTimeout(function () {
                                if (!is_scrolled) {
                                    container.scrollTop = container.scrollHeight;
                                }
                            }, 50);
                        }, 2000);

                        break;
                    }
                }
            }

            prev_obj = JSON.parse(JSON.stringify(obj));
        }
    }

    onMount(() => {
        prev_obj = JSON.parse(JSON.stringify(obj));
        console.log(prev_obj);
        console.log(
            obj.objects.filter((o) => {
                return o.id == "texts";
            })[0],
        );
        event_callback(
            obj,
            obj.objects.filter((o) => {
                return o.id == "texts";
            })[0],
        );

        if (container !== undefined) {
            container.addEventListener("scroll", function (e) {
                if (Math.abs(container.scrollTop - (container.scrollHeight - container.clientHeight)) > 10) {
                    is_scrolled = true;
                } else {
                    is_scrolled = false;
                }
            });
        }

        setTimeout(function () {
            container.scrollTop = container.scrollHeight;
        }, 50);

        // Timed Answer Options

        const texts = obj.objects.filter((o) => {return o.type == "texts"})[0];
        const intervals = [];
        const timeouts = [];

        console.log(texts)
        
        if (texts) {
            const dialogue = texts.dialogue;
            const timedAnswerDialogues = dialogue.filter((d) => {return d.answer_timer !== undefined});

            timedAnswerDialogues.forEach(dialogue => {
                const dialogueEvent = obj.events.filter((e) => e.target == dialogue.id)[0];
                
                if (dialogueEvent) {
                    let delay = dialogueEvent.delay;

                    timers.push({
                        "id": dialogue.id,
                        "value": dialogue.answer_timer.duration,
                        "duration": dialogue.answer_timer.duration,
                        "canceled": false
                    });

                    setTimeout(() => {
                        const interval = setInterval(() => {
                            timers[timers.findIndex(t => t.id == dialogue.id)].value -= 10;

                            // If option chosen
                            if (timers[timers.findIndex(t => t.id == dialogue.id)].canceled == true) {
                                clearInterval(interval);
                            }

                            // If not, excecute default
                            if (timers[timers.findIndex(t => t.id == dialogue.id)].value == 0) {
                                clearInterval(interval);

                                const defaultOption = dialogue.answer_options[dialogue.answer_timer.default_option_index];

                                if (defaultOption && defaultOption.events) {
                                    event_callback(defaultOption);
                                }
                            }
                        }, 10);
                    }, dialogueEvent.delay + 1000);
                }
            });
        }

        return() => {
            intervals.forEach(i => {
                clearInterval(i)
            });

            timeouts.forEach(i => {
                clearTimeout(i)
            });
        }
    });
</script>

<style>
    .scrolling-dialogue-outer {
        background-color: #4a00ff;
        border-radius: 10px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    }

    .scrolling-diaglogue-container {
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-template-rows: auto 1fr;
        position: relative; 
        height: 100%;
        width: 100%;
        background-color: white;
        margin-left: 20px;
        border-radius: 10px;
    }

    .scrolling-diaglogue-header {
        grid-column: 2 / 3;
        text-align: right;
        font-style: italic;
        padding: 40px 40px 20px 40px;
        padding-left: 33%;
    }

    .avatar-container {
        position: relative;
        display: grid;
        grid-gap: 20px;
        z-index: 50;
        left: -100%;
        align-content: center;
        grid-row: 1 / 3;
    }

    .avatar {
        width: 60px; 
        height: 60px; 
        border-radius: 50%; 
        background-color: black;
        transition: all 0.2s;
        background-size: cover;
        background-position: center;
        border: 2px solid white;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    }

    .avatar.active {
        width: 90px; 
        height: 90px; 
    }

    .texts {
        grid-column: 2 / 3;
        grid-row: 2 / 3;
        padding: 40px;
        overflow-y: auto;
    }

    .thought-bubble {
        border: 2px dotted #067FFE;
        background-color: transparent !important;
        border-radius: 10px;
        padding: 8px 16px;
        color: black;
        grid-column: 2 / 3;
    }

    .timer-toolbar-container {
        position: relative;
        height: 14px;
        width: 100%;
        border-radius: 10px;
        background-color: white;
        border: 2px solid #4a00ff;
        padding: 2px;
    }

    .timer-toolbar-fill {
        height: 6px;
        background-color: #4a00ff;
        border-radius: 7px;
    }
</style>

<div
    class="absolute scrolling-dialogue-outer"
    style="
        {obj.width !== undefined ? 'width: ' + obj.width + '; ' : ''}
        {obj.height !== undefined ? 'height: ' + obj.height + '; ' : ''}
        {obj.x !== undefined ? 'left: ' + obj.x + '; ' : ''}
        {obj.y !== undefined ? 'top: ' + obj.y + '; ' : ''} 
        {obj.backgroundColor !== undefined ? `background-color: ${obj.backgroundColor};` : ''}
        "
>
    <div class="scrolling-diaglogue-container">
        {#if obj.objects !== undefined}
            {#each obj.objects as o}
                {#if o.visible}
                    {#if o.type == "sprite"}
                        <div class="scrolling-diaglogue-header">
                            {#if o.text !== undefined}
                                {@html variables_in_text(o.text)}
                            {/if}
                        </div>
                    {/if}

                    {#if o.type == "avatars"}
                        <div class="avatar-container">
                            {#each o.objects as avatar }
                                <div class="
                                        avatar 
                                        {avatar.id == last_avatar_id ? "active" : ""}
                                    " 
                                    id="{avatar.id}" 
                                    style="background-image: url('{avatar.img}'); {avatar.visible == false ? "display: none" : ""}"
                                >
                                </div>
                            {/each}
                        </div>
                    {/if}

                    {#if o.type == "texts"}
                        <div class="texts" bind:this={container}>
                            {#if o.dialogue !== undefined}
                                <div class="relative w-full pb-[5%]">
                                    {#each o.dialogue as d}
                                        {#if d.visible !== undefined && d.visible}
                                            {#if d.type !== undefined && d.type == "notification"}
                                                <div
                                                    class="w-full text-[0.75vw] p-[2%] mt-6 mb-6 rounded-md text-center"
                                                    style="background-color: rgb(240,240,240)"
                                                >
                                                    {@html variables_in_text(d.content)}
                                                </div>
                                            {:else if d.is_player !== undefined && d.is_player}
                                                <div class="chat chat-end">
                                                    {#if d.name !== undefined}
                                                        <div
                                                            class="chat-header font-bold"
                                                            style="{d.name_color !== undefined
                                                                ? 'color: ' + d.name_color + '; '
                                                                : ''} {o.text_size !== undefined
                                                                ? 'font-size: ' + o.text_size + '; '
                                                                : ''}
                                                                {d.type == "thought" ? "grid-column: 2 / 3;" : ""}
                                                                ">
                                                            {d.name}
                                                        </div>
                                                    {/if}

                                                    <div class="{d.type == 'thought' ? 'thought-bubble' : 'chat-bubble'} bg-[#067FFE] text-white">
                                                        {@html variables_in_text(d.content)}
                                                    </div>

                                                    {#if typing_id !== d.id && last_id === d.id && d.answer_options !== undefined && d.answer_options.length > 0}
                                                        {#each d.answer_options as a}
                                                            {#if a.type !== undefined && a.type == "next"}
                                                                <button
                                                                    class="btn btn-circle btn-sm bg-black hover:bg-[#5E5E5E] relative left-[0%] mt-4 col-start-1 col-end-3"
                                                                    on:click={a.events !== undefined &&
                                                                    a.events.length > 0
                                                                        ? callback_event_and_cancel_timer(a, d)
                                                                        : undefined}
                                                                >
                                                                    <svg
                                                                        width="100%"
                                                                        height="100%"
                                                                        viewBox="0 0 16 16"
                                                                        fill="#ffffff"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        xml:space="preserve"
                                                                        xmlns:serif="http://www.serif.com/"
                                                                        style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
                                                                        class="w-5 h-5"
                                                                    >
                                                                        <path
                                                                            d="M2,8C2,7.589 2.339,7.25 2.75,7.25L11.44,7.25L8.22,4.03C8.091,3.891 8.019,3.708 8.019,3.519C8.019,3.107 8.357,2.769 8.769,2.769C8.958,2.769 9.141,2.841 9.28,2.97L13.78,7.47C14.071,7.761 14.071,8.239 13.78,8.53L9.28,13.03C9.141,13.159 8.958,13.231 8.769,13.231C8.357,13.231 8.019,12.893 8.019,12.481C8.019,12.292 8.091,12.109 8.22,11.97L11.44,8.75L2.75,8.75C2.339,8.75 2,8.411 2,8Z"
                                                                            style="stroke:#ffffff;stroke-width:1.38px;"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            {:else}
                                                                <button class="btn btn-primary w-full text-[1.25vw] h-auto min-h-[4vw] mt-4 col-start-1 col-end-3" on:click={(a.events !== undefined && a.events.length > 0)?callback_event_and_cancel_timer(a, d):undefined}>{@html a.content}</button>
                                                            {/if}
                                                        {/each}

                                                        {#if d.answer_timer !== undefined && d.answer_timer.default_option_index !== undefined}
                                                            <div class="timer-toolbar-container col-start-1 col-end-3 mt-4" style="width: 100%;">
                                                                <div class="timer-toolbar-fill" style="background-color: {obj.backgroundColor ? obj.backgroundColor : ''}; width: {(timers[timers.findIndex(t => t.id == d.id)].duration - timers[timers.findIndex(t => t.id == d.id)].value) / timers[timers.findIndex(t => t.id == d.id)].duration * 100}%">
                                                                </div>
                                                            </div>  
                                                        {/if}
                                                    {/if}
                                                </div>
                                            {:else}
                                                <div class="chat chat-start">
                                                    {#if d.name !== undefined}
                                                        <div
                                                            class="chat-header font-bold"
                                                            style="{d.name_color !== undefined
                                                                ? 'color: ' + d.name_color + '; '
                                                                : ''} {o.text_size !== undefined
                                                                ? 'font-size: ' + o.text_size + '; '
                                                                : ''}"
                                                        >
                                                            {d.name}
                                                        </div>
                                                    {/if}
                                                    <div class="{d.type == 'thought' ? 'thought-bubble' : 'chat-bubble'} bg-[#E5E5EA] text-black">
                                                        {#if typing_id !== d.id}
                                                            {@html variables_in_text(d.content)}
                                                        {:else}
                                                            ...
                                                        {/if}
                                                    </div>

                                                    {#if typing_id !== d.id && last_id === d.id && d.answer_options !== undefined && d.answer_options.length > 0}
                                                        {#each d.answer_options as a}
                                                            {#if a.type !== undefined && a.type == "next"}
                                                                <button
                                                                    class="btn btn-circle btn-sm bg-black hover:bg-[#5E5E5E] relative left-[0%] mt-4 col-start-1 col-end-3"
                                                                    on:click={a.events !== undefined &&
                                                                    a.events.length > 0
                                                                        ? callback_event_and_cancel_timer(a, d)
                                                                        : undefined}
                                                                >
                                                                    <svg
                                                                        width="100%"
                                                                        height="100%"
                                                                        viewBox="0 0 16 16"
                                                                        fill="#ffffff"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        xml:space="preserve"
                                                                        xmlns:serif="http://www.serif.com/"
                                                                        style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
                                                                        class="w-5 h-5"
                                                                    >
                                                                        <path
                                                                            d="M2,8C2,7.589 2.339,7.25 2.75,7.25L11.44,7.25L8.22,4.03C8.091,3.891 8.019,3.708 8.019,3.519C8.019,3.107 8.357,2.769 8.769,2.769C8.958,2.769 9.141,2.841 9.28,2.97L13.78,7.47C14.071,7.761 14.071,8.239 13.78,8.53L9.28,13.03C9.141,13.159 8.958,13.231 8.769,13.231C8.357,13.231 8.019,12.893 8.019,12.481C8.019,12.292 8.091,12.109 8.22,11.97L11.44,8.75L2.75,8.75C2.339,8.75 2,8.411 2,8Z"
                                                                            style="stroke:#ffffff;stroke-width:1.38px;"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            {:else}
                                                                <button class="btn btn-primary w-full text-[1.25vw] h-auto min-h-[4vw] mt-4 col-start-1 col-end-3" on:click={(a.events !== undefined && a.events.length > 0)?callback_event_and_cancel_timer(a, d):undefined}>{@html a.content}</button>
                                                            {/if}
                                                        {/each}

                                                        {#if d.answer_timer !== undefined && d.answer_timer.default_option_index !== undefined}
                                                            <div class="timer-toolbar-container col-start-1 col-end-3 mt-4" style="width: 100%;">
                                                                <div class="timer-toolbar-fill" style="background-color: {obj.backgroundColor ? obj.backgroundColor : ''}; width: {(timers[timers.findIndex(t => t.id == d.id)].duration - timers[timers.findIndex(t => t.id == d.id)].value) / timers[timers.findIndex(t => t.id == d.id)].duration * 100}%">
                                                                </div>
                                                            </div>  
                                                        {/if}
                                                    {/if}
                                                </div>
                                            {/if}
                                        {/if}
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/if}
                {/if}
            {/each}
        {/if}
    </div>
</div>
