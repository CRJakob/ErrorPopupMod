Div = function(block)
    block.attributes['style'] = "color: #ffffff; padding: 0.5em; font-size: 22px"
    return block
end

Header = function(heading)
    if heading.level == 1 then
        heading.attributes['style'] = "color: #ffffff; text-align: center"
    end
    return heading
end
