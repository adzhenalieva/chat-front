$(function () {
    var preloader = $('#preloader');
    $(document).ajaxStop(function () {
        preloader.hide();
    });
    var getTime = function (response) {
        var datetime1 = response.datetime;
        var date = datetime1.split('T')[0];
        var minutes = datetime1.split('T')[1];
        minutes = minutes[0] + minutes[1] + minutes[2] + minutes[3] + minutes[4];
        return time = date + ' ' + minutes;
    };
    var printPosts = function (result) {
        var messageDiv = $('<div class="messageDiv">');
        var br = $('<br />');
        messageDiv.append($('<span class="time">').html(getTime(result)), '  ', $('<span class="author">').html(result.user.lastName + ' ' + result.user.firstName), br, $('<span class="text">').html(result.message));
        return messageDiv;
    };

    var getLoadPage = function () {
        $.ajax({
            method: 'GET',
            url: "http://146.185.154.90:8000/blog/aisalkyn1989@mail.ru/posts",
            beforeSend: function () {
                preloader.show();
            },
            success: function (response) {
                var last = response.length - 1;
                console.log(response);
                for (i = 0; i < response.length; i++) {
                    var result = response[i];
                    $('#posts').prepend(printPosts(result));
                }
                var lastDate = response[last].datetime;

                setInterval(function () {
                    $.get('http://146.185.154.90:8000/blog/aisalkyn1989@mail.ru/posts?datetime=' + lastDate)
                        .then(function (response) {
                            if (response.length === 0) {
                                console.log('there is no new posts')
                            }
                            else {
                                for (i = 0; i < response.length; i++) {
                                    var result = response[i];
                                    $('#posts').prepend(printPosts(result));
                                }
                                var last = response.length - 1;
                                lastDate = response[last].datetime;
                            }
                        })
                        .catch(function (error) {
                            alert('Error!');
                        });
                }, 5000);
            },
            error: function (xhr) {
                alert('Error ' + xhr.status + '.');
            }
        });
    };
    $.get("http://146.185.154.90:8000/blog/aisalkyn1989@mail.ru/profile")
        .then(function (response) {
            var result = response;
            $('#main').html(result.firstName + ' ' + result.lastName);
            getLoadPage();
        })
        .catch(function (error) {
            alert('Error!');
        });


    $('#saveName').on('click', function () {
        var firstName = $('#firstName').val();
        var lastName = $('#lastName').val();
        $.post("http://146.185.154.90:8000/blog/aisalkyn1989@mail.ru/profile", {
            'firstName': firstName,
            'lastName': lastName
        })
            .then(function () {
                $('#main').html(firstName + ' ' + lastName);
            })
            .catch(function (error) {
                alert('Error!');
            });
    });

    $('#sendMessage').on('click', function () {
        var messageText = $('#message').val();
        $.post("http://146.185.154.90:8000/blog/aisalkyn1989@mail.ru/posts", {'message': messageText})
            .then(function () {
                $('#message').val('');
            })
            .catch(function (error) {
                alert('Error!');
            });
    });
    $('#subscribe').on('click', function () {
        var newEmail = $('#subscribeNewMail').val();
        $.post("http://146.185.154.90:8000/blog/aisalkyn1989@mail.ru/subscribe", {'email': newEmail})
            .then(function () {
                alert("You have subscribed to " + newEmail + "\n" + "From now on you can receive posts from new subscription");
            })
            .catch(function (error) {
                alert('Error!');
            });
    });

    $('#checkSubscriptions').on('click', function () {
        $.get("http://146.185.154.90:8000/blog/aisalkyn1989@mail.ru/subscribe")
            .then(function (response) {
                if (response.length === 0) {
                    alert("You don not have any subscriptions! To subscribe, press the botton 'Follow user'");
                } else {
                    for (i = 0; i < response.length; i++) {
                        var result = response[i];
                        var followersDiv = $('<div class="followersDiv">');
                        var br = $('<br />');
                        followersDiv.append($('<span class="follower">').html(result.firstName + ', e-mail: ' + result.email));

                        $('#subscriptons').append(followersDiv);
                        $('#subscriptons').show();
                    }
                }
            })
            .catch(function (error) {
                alert('Error!');
            });
    });
    $(document).on('click', '#closeDiv', function () {
        $('#subscriptons').hide();
        $('#subscriptons').html($('<button id="closeDiv">X</button>'));
    })
    $('#unsubscribe').on('click', function () {
        $.post("http://146.185.154.90:8000/blog/aisalkyn1989@mail.ru/subscribe/delete")
            .then(function () {
                alert("You've unsubscribe all subscriptions. You will not receive new posts from them");
            })
            .catch(function (error) {
                alert('Error!');
            });
    });
});