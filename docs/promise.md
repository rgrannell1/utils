# promise (v7.0.0)



<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## stall

~

### Parameters

-   `fn`  
-   `duration`   (optional, default `0`)
-   `the` **[function][1]** function to call post stall
-   `the` **[number][2]** timeout in millisecondsWait for a set time-period before resolving

Returns **[promise][3]** 

## timeout

### Parameters

-   `error`  
-   `duration`   (optional, default `0`)
-   `the` **[error][4]** error to throw
-   `the` **[number][2]** timeout in millisecondsTrello API wrapper

Returns **[promise][3]** 

## waitUntil

### Parameters

-   `fn` **[function][1]** a sync or async function.
-   `interval` **[number][2]** the polling interval.Wait until a sync or async function resolves. (optional, default `0`)

Returns **[promise][3]** 

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error