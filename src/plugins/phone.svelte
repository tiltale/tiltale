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