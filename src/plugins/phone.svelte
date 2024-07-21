<div class="absolute" style="
{(obj.width !== undefined)?'width: ' + obj.width + '; ':''}
{(obj.height !== undefined)?'height: ' + obj.height + '; ':''}
{(obj.x !== undefined)?'left: ' + obj.x + '; ':''}
{(obj.y !== undefined)?'top: ' + obj.y + '; ':''} 
">
<!-- The background image -->
<div>
    <img src="img/phone/bg.svg" class="relative pointer-events-none" style="z-index: 5" />
    {#if obj.background !== undefined}
    <div class="absolute top-[4%] left-[3%] w-[93%] h-[87%]" style="background-color: {obj.background}">
      &nbsp;
    </div>
    {/if}

    {#if obj.objects !== undefined}
    {#each obj.objects as o}
    {#if o.visible}
        {#if o.type == 'sprite'}
        <div class="absolute" style="
        {(o.width !== undefined)?'width: ' + o.width + '; ':''}
        {(o.height !== undefined)?'height: ' + o.height + '; ':''}
        {(o.x !== undefined)?'left: ' + o.x + '; ':''}
        {(o.y !== undefined)?'top: ' + o.y + '; ':''} 
        {(o.z !== undefined)?'z-index: ' + o.z + '; ':''} 
    ">
        {#if o.image !== undefined}
        <img src="project/img/{o.image}" draggable="false" />
        {/if}

        {#if o.text !== undefined}
        <div class="absolute" style=" 
        {(o.text_color !== undefined)?'color: ' + o.text_color + '; ':''}        
        {(o.text_x !== undefined)?'left: ' + o.text_x + '; ':''}
        {(o.text_y !== undefined)?'top: ' + o.text_y + '; ':''} 
        {(o.text_size !== undefined)?'font-size: ' + o.text_size + '; ':''}">
            {@html variables_in_text(o.text)}
        </div>
        {/if}

        </div>
        {/if}

        {#if o.type == 'texts'}
        <div class="absolute p-[6%] ml-[4%] overflow-y-auto" bind:this={container} style="
        {(o.width !== undefined)?'width: ' + o.width + '; ':''}
        {(o.height !== undefined)?'height: ' + o.height + '; ':''}
        {(o.x !== undefined)?'left: ' + o.x + '; ':''}
        {(o.y !== undefined)?'top: ' + o.y + '; ':''} 
        {(o.z !== undefined)?'z-index: ' + o.z + '; ':''} 
        {(o.text_size !== undefined)?'font-size: ' + o.text_size + '; ':''}
        {(o.background !== undefined)?'background-color: ' + o.background + '; ':''}
    ">
            {#if o.dialogue !== undefined}
            <div class="relative w-full pb-[5%]">
            {#each o.dialogue as d}
            {#if d.visible !== undefined && d.visible}
            {#if d.type !== undefined && d.type == 'notification'}
            <div class="w-full text-[0.75vw] p-[2%] mt-4 rounded-md" style="{d.background !== undefined?'background-color: ' + d.background + ';':''}">
              {variables_in_text(d.content)}
            </div>
            {:else}
            <div class="chat chat-start">
                <div class="chat-image avatar">
                  <div class="w-[2.5vw] mt-[3vw] rounded-full">
                    {#if d.avatar !== undefined}
                    <img src="project/img/{d.avatar}" />
                    {/if}
                  </div>
                </div>
                {#if d.name !== undefined}
                <div class="chat-header font-bold" style="{d.name_color !== undefined?'color: ' + d.name_color + '; ':''} {(o.text_size !== undefined)?'font-size: ' + o.text_size + '; ':''}">{d.name}</div>
                {/if}
                <div class="chat-bubble bg-[#E5E5EA] text-black">
                  {#if typing_id !== d.id}
                  {@html variables_in_text(d.content)}                
                  {:else}
                  ...
                  {/if}
                </div>

                {#if typing_id !== d.id && last_id === d.id && d.answer_options !== undefined && d.answer_options.length > 0}
                {#each d.answer_options as a}
                {#if a.type === undefined || a.type !== 'next'}
                {/if}
                {#if a.type !== undefined && a.type == 'next'}
                <button class="btn btn-circle btn-sm bg-black hover:bg-[#5E5E5E] relative left-[81%] mt-4 col-start-1 col-end-3" on:click={(a.events !== undefined && a.events.length > 0)?event_callback(a):undefined}>
                    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="#ffffff" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" class="w-5 h-5">
                        <path d="M2,8C2,7.589 2.339,7.25 2.75,7.25L11.44,7.25L8.22,4.03C8.091,3.891 8.019,3.708 8.019,3.519C8.019,3.107 8.357,2.769 8.769,2.769C8.958,2.769 9.141,2.841 9.28,2.97L13.78,7.47C14.071,7.761 14.071,8.239 13.78,8.53L9.28,13.03C9.141,13.159 8.958,13.231 8.769,13.231C8.357,13.231 8.019,12.893 8.019,12.481C8.019,12.292 8.091,12.109 8.22,11.97L11.44,8.75L2.75,8.75C2.339,8.75 2,8.411 2,8Z" style="stroke:#ffffff;stroke-width:1.38px;"/>
                    </svg>
                </button>            
                {/if}
                {/each}
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

<script lang="ts">
    import { onMount } from "svelte";
    export let obj = {};
    export let variables_in_text = undefined;
    export let event_callback = undefined;
    let prev_obj = {};
    let typing_id = '';
    let last_id = '';
    let container: HTMLElement;

      $: {
        console.log(prev_obj);
        if (Object.keys(prev_obj).length > 0) {
          let new_texts = obj.objects.filter(o => { return o.id == 'texts' })[0];
          let old_texts = prev_obj.objects.filter(o => { return o.id == 'texts' })[0];

          for (let d of new_texts.dialogue) {
            let old_d = old_texts.dialogue.filter(od => { return od.id == d.id})[0];
            if (old_d.visible !== d.visible) {
              typing_id = d.id;
              last_id = typing_id;
              setTimeout(function() {
                container.scrollTop = container.scrollHeight;
              }, 50);
              setTimeout(function() {
                typing_id = '';
                setTimeout(function() {
                  container.scrollTop = container.scrollHeight;
                }, 50);
              }, 2000);
              break;
            }
          }
          
          prev_obj = JSON.parse(JSON.stringify(obj));
        }
      }

    onMount(() => {
      prev_obj = JSON.parse(JSON.stringify(obj));
      console.log(prev_obj);
      console.log(obj.objects.filter(o => { return o.id == 'texts' })[0]);
      event_callback(obj, obj.objects.filter(o => { return o.id == 'texts' })[0]);
    });    
</script>