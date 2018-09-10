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
    | NoValue

-- generate : TestableCmd a msg

captureValue : a -> TestableCmd a msg
captureValue a =
    TestableCmd ( a, Cmd.none )

none : TestableCmd a msg
none =
  NoValue



mapMsg : (msg1 -> msg2) -> TestableCmd a msg1 -> TestableCmd a msg2
mapMsg f cmd =
  case cmd of
    (TestableCmd ( a, cmd )) ->
      TestableCmd ( a, cmd |> Cmd.map f )
    NoValue ->
      NoValue
batchCmds: List (TestableCmd a msg )-> TestableCmd a msg
batchCmds

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

expectNoCmd : TestableCmd a msg -> Bool
expectNoCmd (TestableCmd ( _, cmd )) =
  cmd == Cmd.none
