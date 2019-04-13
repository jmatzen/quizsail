# QuizPump

Test Prep Engine

### QuizQuizer contains a sample set of data comprising of a 240+ item set questions for WGU C857 Software QA.

The test prep engine uses a technique called *assumed competency*.  This technique assumes that if you answer the question correctly the first time that you already know the answer. Because of this, it's running on sort of an honor system, so if the user is not sure what the answer is they should not enter any answer at all instead of guessing.

A minor code change can remove the assumption and require the user to correctly answer the question up to the required number of times.

QuizQuizer's competency system works by holding a certain number of questions from the pool in-flight.  Once the user has correctly answered a question in the in-flight state so many times in a row, the question is moved to the completed state and is not asked again.  As long as the in-flight pool is full, the next question to appear is randomly selected from the questions in the pool that aged the most so that the same question is not likely to be asked twice in a row.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

* node


### Installing

* Clone this repo, run index.js with node.

```
$ node index.js
```

Then, open your browser and enter
```
http://localhost:3000/?session=YOUR_SESSION_ID
```

The session ID can be any string.  Internally it is hashed (with MD5, which while not cryptographically secure is fine for content hashing where security is not an issue and performance is a higher priority) and a file is stored with the hased value in hex encoding.

## Contributing

Use pull requests.


## Authors

* **John Matzen** - *Initial work* - [jmatzen](https://github.com/jmatzen)


## License

This project is licensed under CC BY-NC-SA 4.0 - see  [https://creativecommons.org/licenses/by-nc-sa/4.0/](https://creativecommons.org/licenses/by-nc-sa/4.0/) file for details
