$(document).ready(function() {

});

$('#comments').on('shown.bs.collapse', function () { 
    document.getElementById('see-comments-link').textContent = "Hide"
  }) 

$('#comments').on('hidden.bs.collapse', function () { 
document.getElementById('see-comments-link').textContent = "Show All Comments"
}) 