module TestableCmd exposing
    ( TestableCmd
    , captureValue
    , equal
    , expectEvaluationToBeFalse
    , expectEvaluationToBeTrue
    , mapMsg
    , update
    )


type TestableCmd a msg
    = TestableCmd ( a, Cmd msg )


captureValue : a -> TestableCmd a msg
captureValue a =
    TestableCmd ( a, Cmd.none )


mapMsg : (msg1 -> msg2) -> TestableCmd a msg1 -> TestableCmd a msg2
mapMsg f (TestableCmd ( a, cmd )) =
    TestableCmd ( a, cmd |> Cmd.map f )


update : (msg -> model -> ( model, TestableCmd a msg )) -> msg -> model -> ( model, Cmd msg )
update updater msg model =
    updater msg model
        |> Tuple.mapSecond (\(TestableCmd ( a, cmd )) -> cmd)


expectEvaluationToBeTrue : (a -> Bool) -> TestableCmd a msg -> Bool
expectEvaluationToBeTrue f (TestableCmd ( a, _ )) =
    f a == True


expectEvaluationToBeFalse : (a -> Bool) -> TestableCmd a msg -> Bool
expectEvaluationToBeFalse f (TestableCmd ( a, _ )) =
    f a == False


equal : a -> TestableCmd a msg -> Bool
equal a (TestableCmd ( b, _ )) =
    a == b
