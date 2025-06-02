<?php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('facturas1', FacturaController::class);
});
