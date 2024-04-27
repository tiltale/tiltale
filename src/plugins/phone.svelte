<div class="absolute" style="
{(obj.width !== undefined)?'width: ' + obj.width + '; ':''}
{(obj.height !== undefined)?'height: ' + obj.height + '; ':''}
{(obj.x !== undefined)?'left: ' + obj.x + '; ':''}
{(obj.y !== undefined)?'top: ' + obj.y + '; ':''} 
{(obj.events !== undefined && obj.events.length > 0)?'cursor: pointer; ':''}
" 
on:click={(obj.events !== undefined && obj.events.length > 0)?click_callback(obj):undefined}>
<!-- The background image -->
<div>
    <img src="img/phone/bg.svg" style="z-index: -1" />

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
        </div>
        {/if}

        {#if o.type == 'texts'}
        <div class="absolute p-[10%]" style="
        {(o.width !== undefined)?'width: ' + o.width + '; ':''}
        {(o.height !== undefined)?'height: ' + o.height + '; ':''}
        {(o.x !== undefined)?'left: ' + o.x + '; ':''}
        {(o.y !== undefined)?'top: ' + o.y + '; ':''} 
        {(o.z !== undefined)?'z-index: ' + o.z + '; ':''} 
        {(o.text_size !== undefined)?'font-size: ' + o.text_size + '; ':''} 
    ">
            {#if o.dialogue !== undefined}
            {#each o.dialogue as d}
            <div class="chat chat-start">
                <div class="chat-image avatar">
                  {#if d.avatar !== undefined}
                  <div class="w-[2.5vw] mt-[3vw] rounded-full">
                    <img src="project/img/{d.avatar}" />
                  </div>
                  {/if}
                </div>
                {#if d.name !== undefined}
                <div class="chat-header font-bold" style="{d.name_color !== undefined?'color: ' + d.name_color + '; ':''} {(o.text_size !== undefined)?'font-size: ' + o.text_size + '; ':''}">{d.name}</div>
                {/if}
                <div class="chat-bubble bg-[#E5E5EA] text-black">{variables_in_text(d.content)}</div>
              </div>            
            {/each}
            {/if}
        </div>
        {/if}
    {/if}
    {/each}
    {/if}
</div>

</div>

<script lang="ts">
    export let obj = {};
    export let variables_in_text = undefined;
    export let click_callback = undefined;
</script>