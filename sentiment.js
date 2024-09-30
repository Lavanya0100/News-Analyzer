$(document).ready(function () {
    // Function to analyze sentiment based on keywords
    function analyzeSentiment(text) {
        const positiveWords = ['good', 'great', 'positive', 'happy', 'excellent','gains','jailed','punished','triumph','victory','win','trophy'];
        const negativeWords = ['bad', 'terrible', 'negative', 'sad', 'poor', 'hijack', 'rape', 'murder', 'assault', 'molest', 'theft', 'dowry', 'death', 'killed', 'accidents', 'hit', 'injured', 'lost', 'derail', 'explosion', 'bomb', 'gun', 'abuse','dies','killing','hurricane','earthquake','terrorists','burns'];

        let sentimentScore = 0;

        positiveWords.forEach(word => {
            if (text.toLowerCase().includes(word)) sentimentScore++;
        });

        negativeWords.forEach(word => {
            if (text.toLowerCase().includes(word)) sentimentScore--;
        });

        return sentimentScore > 0 ? 'Positive' : sentimentScore < 0 ? 'Negative' : 'Neutral';
    }

    // Function to fetch news and categorize
    $('#fetch-category-news').click(function () {
        console.log("Fetching categorized news..."); // Log that fetching is initiated

        $.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://newsapi.org/v2/top-headlines?country=in&apiKey=8d06bdc4e6e842528a38633d1f0882ea'), function(data) {
            const articles = JSON.parse(data.contents).articles; // Parse the articles from the response
            console.log("Data received:", articles); // Log the data received from the API

            // Clear previous results
            $('#sports-news, #international-news, #national-politics-news, #miscellaneous-news').empty();

            if (articles && articles.length > 0) {
                articles.forEach(article => {
                    const sentiment = analyzeSentiment(article.title); // Analyze sentiment
                    const articleHtml = `
                        <div class="news-article">
                            <h2>${article.title}</h2>
                            <p>${article.description}</p>
                            <p><strong>Sentiment: ${sentiment}</strong></p>
                        </div>
                    `;

                    // Categorize the article
                    if (article.title.toLowerCase().includes('sports')) {
                        $('#sports-news').append(articleHtml);
                    } else if (article.title.toLowerCase().includes('india')) {
                        $('#national-politics-news').append(articleHtml);
                    } else if (article.title.toLowerCase().includes('international')) {
                        $('#international-news').append(articleHtml);
                    } else {
                        $('#miscellaneous-news').append(articleHtml);
                    }
                });
            } else {
                $('#news-container').append('<p>No news articles found.</p>');
            }
        }).fail(function(xhr, status, error) {
            console.error("Error fetching news articles:", status, error); // Log error details
            $('#news-container').append('<p>Error fetching news articles. Please try again later.</p>');
        });
    });

    // Function to fetch all news (without categories)
    $('#fetch-all-news').click(function () {
        console.log("Fetching all news...");

        $.get('https://api.allorigins.win/get?url=' + encodeURIComponent('https://newsapi.org/v2/top-headlines?country=us&apiKey=8d06bdc4e6e842528a38633d1f0882ea'), function(data) {
            const articles = JSON.parse(data.contents).articles; // Parse the articles from the response
            console.log("Data received:", articles); // Log the data received from the API

            // Clear previous results
            $('#news-container').empty();

            if (articles && articles.length > 0) {
                articles.forEach(article => {
                    const sentiment = analyzeSentiment(article.title); // Analyze sentiment
                    $('#news-container').append(`
                        <div class="news-article">
                            <h2>${article.title}</h2>
                            <p>${article.description}</p>
                            <p><strong>Sentiment: ${sentiment}</strong></p>
                        </div>
                    `);
                });
            } else {
                $('#news-container').append('<p>No news articles found.</p>');
            }
        }).fail(function(xhr, status, error) {
            console.error("Error fetching news articles:", status, error); // Log error details
            $('#news-container').append('<p>Error fetching news articles. Please try again later.</p>');
        });
    });
});
